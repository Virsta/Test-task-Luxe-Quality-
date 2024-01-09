import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MapComponent from './component/map/MapComponent';
import Form from "./component/form/Form";
import { MapProvider } from "./component/MapProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MapComponent />,
  },
  {
    path: "/rent-form",
    element: <Form />,
  },
]
);

const App = () => {
  return (
    <>
    <MapProvider>
      <RouterProvider router={router}/>
    </MapProvider>
      
    </>
    )  
}
 
export default App;


// import { useEffect, useState } from 'react';

// function App() {

//   // const [backendData, setBackendData] = useState([{}]);

//   // useEffect(() => {
//   //   fetch("/api").then(
//   //     response => response.json()
//   //   ).then(
//   //     data => {
//   //       setBackendData(data)
//   //     }
//   //   )
//   // }, [])

//   return (
//     <>
//       {/* {(typeof backendData.users === 'undefined') ? (
//   //       <p>Loading...</p>
//   //     ) : (
//   //       backendData.users.map((user, i) => (
//   //         <p key={i}>{user}</p>
//   //       ))
//   //     )} */}

//     </>
//    );
// }

// export default App;
