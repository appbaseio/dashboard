import { default as React, Component } from 'react';
import { render } from 'react-dom';

var Codemirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/search/searchcursor.js');
require('codemirror/addon/search/search.js');
require('codemirror/addon/dialog/dialog.js');
require('codemirror/addon/edit/matchbrackets.js');
require('codemirror/addon/edit/closebrackets.js');
require('codemirror/addon/comment/comment.js');
require('codemirror/addon/display/placeholder');
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/fold/xml-fold.js');
require('codemirror/addon/fold/markdown-fold.js');
require('codemirror/addon/fold/comment-fold.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/keymap/sublime.js');

export class JsonView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code: '',
			error: {
				title: null,
				message: null
			},
			validFlag: false,
			importType: "data",
			mappingObj: {
				type: 'data',
				input: {}
			}
		};
		this.codemirrorOptions = {
			lineNumbers: true,
			mode: "javascript",
			autoCloseBrackets: true,
			matchBrackets: true,
			showCursorWhenSelecting: true,
			tabSize: 2,
			extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
			foldGutter: true,
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		};
	}
	render() {
		return (
			<Codemirror ref="editor" value={this.props.content} onChange={this.updateCode}
				placeholder='Add json here' options={this.codemirrorOptions} >
			</Codemirror>
		);
	}
}
