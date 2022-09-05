import { ProjectInput } from "./components/projectInput.js";
import { ProjectList } from "./components/projectList.js";
import { ProjectState } from "./state/projectState.js";

const state = ProjectState.getInstance();

new ProjectInput();

new ProjectList('active');

new ProjectList('finished');

export { state }