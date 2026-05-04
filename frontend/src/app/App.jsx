import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useRef, useMemo, useState, useEffect } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

function App() {
  const editorRef = useRef(null);

  // fixed useState
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);

  // load username from URL on refresh
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

    // Set local user
    provider.awareness.setLocalStateField("user", { name: username });

    // Subscribe to awareness changes
    const updateUsers = () => {
      const states = provider.awareness.getStates();
      const userList = Array.from(states.values())
        .map(state => state.user?.name)
        .filter(name => name);
      setUsers(userList);
    };

    provider.awareness.on("change", updateUsers);
    updateUsers(); // Initial update

    // cleanup to avoid memory leaks
    editor.onDidDispose(() => {
      binding.destroy();
      provider.destroy();
    });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    const name = e.target.username.value;

    setUsername(name);

    // persist in URL
    window.history.pushState({}, "", "?username=" + name);
  };

  // join screen
  if (!username) {
  return (
    <main className="h-screen w-full bg-gray-950 flex flex-col items-center justify-center gap-6">
      
      <h1 className="text-white text-3xl font-semibold">
        SyncSpace
      </h1>

      <form
        onSubmit={handleJoin}
        className="flex flex-col gap-4 w-72"
      >
        <input
          type="text"
          placeholder="Enter your username"
          className="p-3 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-gray-500"
          name="username"
          required
        />

        <button
          type="submit"
          className="p-3 rounded-lg bg-gray-200 text-black font-medium hover:bg-gray-300 transition"
        >
          Join
        </button>
      </form>

    </main>
  );
}

  // main editor UI
  return (
    <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
      <aside className="h-full w-1/4 bg-amber-300 rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">Active Users</h2>
        <ul className="space-y-2">
          {users.map((user, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="font-semibold">{user}</span>
            </li>
          ))}
        </ul>
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