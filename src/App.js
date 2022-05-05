import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { withAuthenticator} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";
import { Amplify,API, graphqlOperation,Storage } from "aws-amplify";
import { createNote } from "./graphql/mutations";
import { listNotes } from "./graphql/queries";


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
        const todoData = await API.graphql(graphqlOperation(listNotes));
        const todos = todoData.data.listNotes.items;
 
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
        if (!formState.name || !formState.description) return;
        
        await API.graphql(graphqlOperation(createNote, { input: formState }));
        if (formState.image) {
          const img = await Storage.get(formState.image);
          formState.image = img;
        }
        const todo = { ...formState };

        setTodos([...todos, todo]);
        setFormState(initialState);
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
    setFormState({ ...formState, image: file.name });

    const rez = await Storage.put(file.name, file);
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
        <input type="file" onChange={onChange} style={styles.moj}/>
        <button style={styles.button} onClick={addTodo}>
          Create Todo
        </button>
        
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
  img: {
   width: "px",
  },
  moj: {
    outline: "none",
    height: "80px",
  },
  todo: { marginBottom: 15, border: "1px solid black" },
  input: {
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
