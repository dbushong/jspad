import { h } from 'preact';
import { connect } from 'preact-redux';

function Result({ result }) {
	return h('div', {}, result);
}

function addEntry(docId) {
	return {
		type: 'ADD_ENTRY',
		id: Number(Math.random().toString().slice(2)).toString(36),
		docId
	};
}

function deleteEntry(id, docId) {
	return { type: 'DELETE_ENTRY', id, docId };
}

function renderEntry({ docId, id, input, result }, dispatch) {
	return h('div', { class: 'entry' }, [
		h('div', { class: 'input' }, [
			h('div', { class: 'prompt' }, [ 'In:' ]),
			h('textarea', {
				onChange() {
					// setInput(docId, id, );
				}
			}, input),
			' [',
			h('a', {
				href: '#',
				onClick(e) {
					e.preventDefault();
					dispatch(deleteEntry(id, docId));
				}
			}, 'x'),
			']'
		]),
		result && h('div', { class: 'result' }, [
			h('div', { class: 'prompt' }, [ 'Out:' ]),
			h(Result, { result })
		])
	]);
}

function DocView({ doc, entries, dispatch }) {
	if (!doc) return null;
	return h('div', {}, [
		h('hr'),
		doc.entryIds.map(id => [
			renderEntry({ docId: doc.id, id, ...entries[id] }, dispatch),
			h('hr')
		]),
		h('a', {
			href: '#',
			onClick(e) {
				e.preventDefault();
				dispatch(addEntry(doc.id));
			}
		}, 'Add Entry')
	]);
}

function docProps({ docs, curDoc, entries }) {
	return { doc: curDoc && { id: curDoc, ...docs[curDoc] }, entries };
}

export default connect(docProps)(DocView);