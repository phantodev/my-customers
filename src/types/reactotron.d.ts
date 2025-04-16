import type Reactotron from "reactotron-react-js";

declare global {
  interface Console {
    tron: Reactotron;
  }
}
