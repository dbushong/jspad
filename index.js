import './style';
import { createStore } from 'redux';
import { Provider, connect } from 'preact-redux';
import { h } from 'preact';

const ACTIONS = {
	ADD_DOC(state, { id, title }) {
		return Object.assign({}, state, {
			docs: docs.concat({ id, title }),
			curDoc: id
		});
	}
};

function addDoc(title) {
	return {
		type: 'ADD_DOC',
		id: Number(Math.random().toString().slice(2)).toString(36),
		title
	};
}

let store;

function DocList() {
	return h('ul', {}, [
		h('li', {}, 'first'),
		h('li', {}, 'second'),
		h('li', {}, 'third')
	]);
}

function DocView() {
	return h('div', {}, 'DocView');
}

export default function App() {
	return h(Provider, {}, h('div', {}, [
		h(DocList),
		h(DocView)
	]));
}
