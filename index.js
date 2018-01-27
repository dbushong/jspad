import './style';
import { createStore, compose } from 'redux';
import { Provider } from 'preact-redux';
import { h } from 'preact';
import dp, { set, delete as dpDelete } from 'dot-prop-immutable-chain';
import persistState from 'redux-localstorage';

import DocList from './DocList';
import DocView from './DocView';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = {
	ADD_DOC(state, { id, title }) {
		return dp(state)
			.set('curDoc', id)
			.set('docIds', dids => [...dids, id])
			.set(`docs.${id}`, { title, entryIds: [] })
			.value();
	},

	OPEN_DOC(state, { id }) {
		return set(state, 'curDoc', id);
	},

	ADD_ENTRY(state, { docId, id }) {
		return dp(state)
			.set(`docs.${docId}.entryIds`, eids => [...eids, id])
			.set(`entries.${id}`, { input: '' })
			.value();
	},

	DELETE_ENTRY(state, { docId, id }) {
		return dp(state)
			.delete(`entries.${id}`)
			.set(`docs.${docId}.entryIds`, eids => eids.filter(i => i !== id))
			.value();
	},

	SET_INPUT(state, { id, input }) {
		return dp(state)
			.set(`entries.${id}.input`, input)
			.set(`entries.${id}.result.stale`, true)
			.value();
	},

	SET_RESULT(state, { id, result }) {
		return set(state, `entries.${id}.result`, result);
	},

	DELETE_DOC(state, { id }) {
		const entryIds = state.docs[id].entryIds;
		return dp(state)
			.set('entries', ents => entryIds.reduce(dpDelete, ents))
			.delete(`docs.${id}`)
			.set('docIds', dids => dids.filter(i => i !== id))
			.set('curDoc', null)
			.value();
	}
};

const store = createStore(
	((state, action) => (reducers[action.type] || (s => s))(state, action)),
	{ docIds: [], curDoc: null, entries: {}, docs: {} },
	composeEnhancers(persistState(null, { key: 'jspad' }))
);

export default function App() {
	return h(Provider, { store }, h('div', { }, [
		h(DocList),
		h(DocView)
	]));
}
