import { ProjectInput } from "./components/itemInput";
import { List } from "./components/list";
import { ListState } from "./state/listState";

const state = ListState.getInstance();

new ProjectInput();

new List('active');

new List('pool');

export { state }