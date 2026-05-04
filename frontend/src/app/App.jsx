import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

function App() {
  const editorRef = useRef(null);

  // ✅ fixed useState
  const [username, setUsername] = useState("");

  // ✅ load username from URL on refresh
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("username");
    if (name) setUsername(name);
  }, []);

  // Yjs setup
  const ydoc = useMemo(() => new Y.Doc(), []);
  const ytext = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;

    const provider = new SocketIOProvider(
      "http://localhost:3000",
      "monaco",
      ydoc,
      { autoConnect: true }
    );

    const binding = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );

    // ✅ cleanup to avoid memory leaks
    editor.onDidDispose(() => {
      binding.destroy();
      provider.destroy();
    });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    const name = e.target.username.value;

    setUsername(name);

    // ✅ persist in URL
    window.history.pushState({}, "", "?username=" + name);
  };

  // ✅ join screen
  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex items-center justify-center">
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your username"
            className="p-2 rounded-lg bg-gray-800 text-white"
            name="username"
            required
          />

          <button
            type="submit"
            className="p-2 rounded-lg bg-gray-200 text-black"
          >
            Join
          </button>
        </form>
      </main>
    );
  }

  // ✅ main editor UI
  return (
    <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
      <aside className="h-full w-1/4 bg-amber-300 rounded-lg flex items-center justify-center">
        <p className="font-semibold">👤 {username}</p>
      </aside>

      <section className="w-3/4 bg-neutral-800 rounded-lg">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// Start collaborating..."
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>
    </main>
  );
}

export default App;