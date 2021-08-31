import React from 'react';
import { Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { grey } from 'jest-matcher-utils/node_modules/chalk';
import { blueviolet } from 'color-name';

function App() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  //   const [apiResponse, setApiResponse] = React.useState()

  const handlePost = async () => {
    const contentState = editorState.getCurrentContent();
    const jsonToSend = JSON.stringify(convertToRaw(contentState));
    console.log('what is being sent', jsonToSend);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: jsonToSend }),
    };
    const response = await fetch(
      'http://localhost:5000/api/v1/note',
      requestOptions
    );
    const json = await response.json();
    console.log('response', json);
  };

  const handleGet = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ _id: '612e5aa35299662c43b4ab45' }),
    };
    const response = await fetch(
      'http://localhost:5000/api/v1/note/612e65ef8ba7c8c7f528a03f',
      requestOptions
    );
    const json = await response.json();
    const data = await JSON.parse(json.data.content);

    // console.log('what we get back', json.data.content);
    console.log('what we get back as data', data);

    try {
      setEditorState(EditorState.createWithContent(convertFromRaw(data)));
    } catch (e) {
      console.error(e);
    }

    // console.log(editorState);
    // console.log({ EditorState: json.data.content });

    // const newState = EditorState.createWithContent(json.data.content);
    // EditorState.set(newState, null);
    // setEditorState({ EditorState: json.data.content });
  };

  return (
    <div className="bg-gray-50">
      <Editor
        blockStyleFn={() => 'super'}
        editorState={editorState}
        onChange={setEditorState}
      />
      <button
        className="px-4 py-2 m-2 bg-gray-500 text-gray-50 border rounded"
        onClick={handleGet}
      >
        Get
      </button>
      <button
        className="px-4 py-2 m-2 bg-gray-500 text-gray-50 border rounded-md"
        onClick={handlePost}
      >
        Post
      </button>
    </div>
  );
}

export default App;
