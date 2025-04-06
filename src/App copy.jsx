// import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// const Card = (props) => {
//   const [hasLiked, setHasLiked] = useState(false);

//   useEffect( () => {
//     console.log(`Card ${props.title} has been liked: ${hasLiked}`);
//   });
//   // useEffect is used to perform side effects in function components
//   // it runs after the render is committed to the screen
//   // it can be used to fetch data, update the DOM, or perform other side effects
//   // it takes a function as an argument and runs it after the render
//   // the function can return a cleanup function that runs before the next effect
//   // the second argument is an array of dependencies
//   // if the dependencies change, the effect runs again
//   // if the dependencies are empty, the effect runs only once after the initial render
//   // in this case, we are using it to log the state of the card.
//   return (
//     <div className="card">
//       <h2>{props.title}</h2>
//       <button onClick={() => setHasLiked(!hasLiked)}>
//         {hasLiked ? 'Unlike' : 'Like'}
//       </button>
//     </div>
//   )
// }


// const App = () => {
  
//   return (
//     <div className="card-container">
//       <Card title="Star Wars" />
//       <Card title="Avatar"/>
//       <Card title="Harry Potter"/>
//       <Card title="Lord of the Rings"/>
//       <Card title="Star Trek"/>
//     </div>
//   )}

// export default App


// // its important to decide where states are going to be
// // the best practice is to keep the state as close to the component that needs it as possible
// // in this case, the state is in the Card component
// // this way, we can have multiple cards with their own state
// // this is a simple example of a card component that has a like button
// // the button toggles the state of the card
// // the state is managed by the Card component
// // the App component is just a container for the Card components