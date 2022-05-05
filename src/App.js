import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { withAuthenticator} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState, useContext } from "react";
import { Auth,Hub,Logger,Amplify,API, graphqlOperation,Storage } from "aws-amplify";
import { createNote,deleteNote as deleteNoteMutation } from "./graphql/mutations";
import { listNotes } from "./graphql/queries";
import awsExports from "./aws-exports";
import "./styles/theme.scss";
import { createContext } from "react";
import SignIn from "./sign-in.js";
import SignUp from "./sign-up.js"
import AuthCode from "./AuthCode.js"


Amplify.configure(awsExports);


const initialState = { name: "", description: "" };
const initialLoginState = {
  username: '',
  password: '',
  email: '',
  authCode: '',
  formType: 'signUp'
}

export const LoginContext = createContext("da");


function App({signOut, userAuto}) {

  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);
  const [images,setImages] = useState([])
  const [loginState, updateLoginState] = useState(initialLoginState);
  const [user,updateUser] = useState(null)


  useEffect(() => {
     fetchTodos(); 
     checkUser();
     setAuthListener();
  }, []);

  async function setAuthListener() {
   
const logger = new Logger("My-Logger");

const listener = (data) => {
  switch (data.payload.event) {
    case "signOut":
      logger.info("user signed out");
      console.log(data);
      updateLoginState({...loginState, formType: "signIn"})
      break;
    default:
  }
};

Hub.listen("auth", listener);
  }
  

  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      console.log("user",user)
      updateUser(user)
      updateLoginState({...loginState,formType:"signedIn"})
    } catch (err) {

    }
  }

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
        
        fetchTodos()
        setTodos([...todos, todo]);
        setFormState(initialState);
      } catch (err) {
        console.log("error creating todo:", err);
      }
    }

    async function deleteNote({ id }) {
      console.log(todos,id);
      if(!id) return
      const newNotesArray = todos.filter(note => note.id !== id);
      setTodos(newNotesArray);
     await API.graphql( {query: deleteNoteMutation, variables: {input: {id}}}); 

    }

  async function onChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormState({ ...formState, image: file.name });
    const rez = await Storage.put(file.name, file);
  }

  function handleLoginChange(e){
    e.preventDefault();
    console.log(e.target.value);
     updateLoginState(()=>{
      return {...loginState, [e.target.name]: e.target.value}
    })
    
  }

  const {formType} = loginState;

  async function signUp (e) {
    console.log("hmmm");
    const { username, email, password } = loginState;
    await Auth.signUp({username, password, attributes: {email}})
    updateLoginState(() => ({ ...loginState, formType: "confirmSignUp" }));
  }
  async function confirmSignUp(e) {
    const { username, authCode } = loginState;
    console.log(authCode);
    await Auth.confirmSignUp( username, authCode);
    updateLoginState(() => ({ ...loginState, formType: "signIn" }));
  }
  async function signIn(e) {
    console.log("yeeep");
    const { username, password } = loginState;
    await Auth.signIn({ username, password });
    updateLoginState(() => ({ ...loginState, formType: "signedIn" }));
  }
  return (
    <div className="App">
      {/*CUSTOM AUTHENTICAITON FLOW*/}
      <LoginContext.Provider
        value={{
          handleLoginChange,
          signUp,
          signIn,
          updateLoginState,
          loginState,
          confirmSignUp,
        }}
      >
        {formType === "signUp" && <SignUp></SignUp>}
        {formType === "signIn" && <SignIn></SignIn>}
        {formType === "confirmSignUp" && <AuthCode></AuthCode>}
        {formType === "signedIn" && (
          <div>
            <h1>Hello world</h1>
            <button
              onClick={() => {
                Auth.signOut();
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </LoginContext.Provider>



      {/* {formType === "signUp" && (
        <div>
          Sign up
          <input
            name="username"
            onChange={handleLoginChange}
            placeholder="username"
          />
          <input
            name="password"
            type="password"
            onChange={handleLoginChange}
            placeholder="password"
          />
          <input type="email" name="email" onChange={handleLoginChange} />
          <button onClick={signUp}>Sign up</button>
          <button
            onClick={() => {
              updateLoginState({ ...loginState, formType: "signIn" });
            }}
          >
            Sign in
          </button>
        </div>
      )}
      {formType === "confirmSignUp" && (
        <div>
          Confirm sign up
          <input
            name="authCode"
            onChange={handleLoginChange}
            placeholder="Confirmation Code"
          />
          <button onClick={confirmSignUp}>Confirm Sign up</button>
        </div>
      )}
      {formType === "signIn" && (
        <div>
          Sign in
          <input
            name="username"
            onChange={handleLoginChange}
            placeholder="username"
          />
          <input
            name="password"
            type="password"
            onChange={handleLoginChange}
            placeholder="password"
          />
          <button onClick={signIn}>Sign In</button>
          <button
            onClick={() => {
              updateLoginState({ ...loginState, formType: "signUp" });
            }}
          >
            Create Account
          </button>
        </div>
      )}
      {formType === "signedIn" && (
        <div>
          <h1>Hello world</h1>
          <button
            onClick={() => {
              Auth.signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      )} */}




      {/* <div style={styles.container}>
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
            
            <button onClick={() => deleteNote(todo)}>Delete note</button>
          </div>
        ))}
      </div>
      <button onClick={signOut}>Sign out</button> */}
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

export default App;
