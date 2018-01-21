import { h } from 'preact';
import { connect } from 'preact-redux';

function addDoc(title) {
	return {
		type: 'ADD_DOC',
		id: Number(Math.random().toString().slice(2)).toString(36),
		title
	};
}

function openDoc(id) {
	return { type: 'OPEN_DOC', id };
}

function deleteDoc(id) {
	return { type: 'DELETE_DOC', id };
}

function existingDocs(curDoc, docs, dispatch) {
	return docs.length ? h('ul', {},
		docs.map(doc => h('li', {}, [
			curDoc === doc.id ? h('b', {}, doc.title) :
				h('a', {
					href: '#',
					onClick(e) {
						e.preventDefault();
						dispatch(openDoc(doc.id));
					}
				}, doc.title),
			' [',
			h('a', {
				href: '#',
				onClick(e) {
					e.preventDefault();
					dispatch(deleteDoc(doc.id));
				}
			}, 'x'),
			']'
		]
		))
	) : [];
}

function DocList({ curDoc, docs, docIds, dispatch }) {
	return h('div', {}, [
		existingDocs(curDoc, docIds.map(id => ({ id, ...docs[id] })), dispatch),
		h('a', {
			href: '#',
			onClick(e) {
				e.preventDefault();
				// eslint-disable-next-line no-alert
				dispatch(addDoc(window.prompt('Title?')));
			}
		}, 'Add Doc')
	]);
}

export default connect(s => s)(DocList);