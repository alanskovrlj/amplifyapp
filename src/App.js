import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { withAuthenticator} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";
import { Amplify,API, graphqlOperation,Storage } from "aws-amplify";
import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";


import awsExports from "./aws-exports";
Amplify.configure(awsExports);


const initialState = { name: "", description: "" };

function App({signOut, user}) {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);
  const [images,setImages] = useState([])


  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

    async function fetchTodos() {
      try {
        const todoData = await API.graphql(graphqlOperation(listTodos));
        const todos = todoData.data.listTodos.items;

        await Promise.all(
          todos.map(async (todo) => {
            if (todo.image) {
              const image = await Storage.get(todo.image);
              todo.image = image;
            }
            return todo;
          })
        );
        setTodos(todos);
      } catch (err) {
        console.log("error fetching todos");
      }
    }

    async function addTodo() {
      try {
        console.log(todos);
        if (!formState.name || !formState.description) return;
        console.log("asd",formState);
        if (formState.image) {
          const img = await Storage.get(formState.image);
          formState.image = img;
        }
        const todo = { ...formState };
        setTodos([...todos, todo]);
        setFormState(initialState);
        await API.graphql(graphqlOperation(createTodo, { input: todo }));
      } catch (err) {
        console.log("error creating todo:", err);
      }
    }

  /*   async function fetchImages(){
      let imageKeys = await Storage.list('');
      console.log(imageKeys);
      imageKeys = await Promise.all(imageKeys.map(async k => {
        const signedUrl = await Storage.get(k.key)
        return signedUrl;
      }))
      console.log(imageKeys);
      setImages(imageKeys);
    } */

  async function onChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    console.log(file.name);
    setFormState({ ...formState, image: file.name });

    await Storage.put(file.name, file);
    fetchTodos();
}
  return (
    <div className="App">
      <div style={styles.container}>
        <h2>Amplify Todos</h2>
        <input
          onChange={(event) => setInput("name", event.target.value)}
          style={styles.input}
          value={formState.name}
          placeholder="Name"
        />
        <input
          onChange={(event) => setInput("description", event.target.value)}
          style={styles.input}
          value={formState.description}
          placeholder="Description"
        />
        <input type="file" onChange={onChange} />
        <button style={styles.button} onClick={addTodo}>
          Create Todo
        </button>
        {images.map((img) => {
          return <img src={img} key={img}></img>;
        })}
        {todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={styles.todo}>
            <p style={styles.todoName}>{todo.name}</p>
            <p style={styles.todoDescription}>{todo.description}</p>
            {todo.image && <img src={todo.image} key={todo.image} style={styles.img}></img>}
          </div>
        ))}
      </div>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  img:{
    maxWidth: "400px",
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};

export default withAuthenticator(App);
