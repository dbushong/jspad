import './style';
import { createStore, compose } from 'redux';
import { Provider } from 'preact-redux';
import { h } from 'preact';
import persistState from 'redux-localstorage';

import DocList from './DocList';
import DocView from './DocView';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = {
	ADD_DOC({ docs, docIds, ...state }, { id, title }) {
		return {
			...state,
			docs: { ...docs, [id]: { title, entryIds: [] } },
			docIds: docIds.concat([id]),
			curDoc: id
		};
	},

	OPEN_DOC(state, { id }) {
		return { ...state, curDoc: id };
	},

	ADD_ENTRY({ docs, entries, ...state }, { docId, id }) {
		return {
			...state,
			docs: {
				...docs,
				[docId]: {
					...docs[docId],
					entryIds: docs[docId].entryIds.concat([ id ])
				}
			},
			entries: {
				...entries,
				[id]: { input: '' }
			}
		};
	},

	DELETE_ENTRY({ docs, entries, ...state }, { docId, id }) {
		const { [id]: entry, ...otherEntries } = entries;
		return {
			...state,
			docs: {
				...docs,
				[docId]: {
					...docs[docId],
					entryIds: docs[docId].entryIds.filter(i => i !== id)
				}
			},
			entries: otherEntries
		};
	},

	SET_INPUT({ entries, ...state }, { id, input }) {
		return {
			...state,
			entries: {
				...entries,
				[id]: {
					...entries[id],
					input
				}
			}
		};
	},

	DELETE_DOC({ docs, docIds, ...state }, { id }) {
		const { [id]: doc, ...otherDocs } = docs;
		return {
			...state,
			curDoc: null,
			docs: otherDocs,
			docIds: docIds.filter(i => i!== id)
		};
	}
};

const store = createStore(
	((state, action) => (reducers[action.type] || (s => s))(state, action)),
	{ docIds: [], curDoc: null, entries: {}, docs: {} },
	composeEnhancers(persistState(null, { key: 'jspad' }))
);

export default function App() {
	return h(Provider, { store }, h('div', {}, [
		h(DocList),
		h(DocView)
	]));
}
