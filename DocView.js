import { h } from 'preact';
import { connect } from 'preact-redux';

function classes(obj) {
	return Object.keys(obj).filter(k => obj[k]).join(' ');
}

function Result({ result: { error, value, stale } }) {
	return h('div', { class: classes({ result: 1, error, stale }) },
		[error || JSON.stringify(value)]
	);
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

function setInput(id, input) {
	return { type: 'SET_INPUT', id, input };
}

function makeResult(id, input) {
	// FIXME: isolate with something like:
	// https://github.com/browserify/vm-browserify
	let result;
	try {
		result = { value: eval(`(${input})`) }; // eslint-disable-line no-eval
	}
	catch (err) {
		result = { error: err.stack };
	}
	return { type: 'SET_RESULT', id, result };
}

function renderEntry({ docId, id, input, result }, dispatch) {
	return h('div', { class: 'entry' }, [
		h('div', { class: 'entry-section' }, [
			h('div', { class: 'prompt' }, [ 'In:' ]),
			h('textarea', {
				onChange({ target: { value } }) {
					dispatch(setInput(id, value));
				},
				onKeyPress({ key, ctrlKey, target: { value } }) {
					if (key === 'Enter' && ctrlKey) {
						dispatch(setInput(id, value));
						dispatch(makeResult(id, value));
						return false;
					}
					return true;
				},
				value: input
			}),
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
		result && h('div', { class: 'entry-section' }, [
			h('div', { class: 'prompt' }, [ 'Out:' ]),
			h(Result, { result })
		])
	]);
}

function DocView({ dispatch, entries, id: docId }) {
	if (!docId) return null;
	return h('div', {}, [
		h('hr'),
		entries.map(entry => [
			renderEntry({ docId, ...entry }, dispatch),
			h('hr')
		]),
		h('a', {
			href: '#',
			onClick(e) {
				e.preventDefault();
				dispatch(addEntry(docId));
			}
		}, 'Add Entry')
	]);
}

function docProps({ docs, curDoc, entries }) {
	if (!curDoc) return {};
	const doc = docs[curDoc];
	return {
		id: curDoc,
		entries: doc.entryIds.map(id => ({ id, ...entries[id] })),
		...doc
	};
}

export default connect(docProps)(DocView);