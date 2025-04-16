import Reactotron from "reactotron-react-js";
import reactotronZustand from "reactotron-plugin-zustand";
import { useStore } from "./stores/useStore";



if (typeof window !== "undefined") {
  Reactotron.configure({ name: "App My Customers" })
    .use(
      reactotronZustand({
        stores: [
          { name: "mainStore", store: useStore },
        ],
      })
    )
    .connect(); // let's connect!
  console.tron = Reactotron; // Para facilitar o uso do console.tron.log
}

export default Reactotron;
