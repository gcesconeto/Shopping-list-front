import { ProjectInput } from "./components/projectInput";
import { ProjectList } from "./components/projectList";
import { ProjectState } from "./state/projectState";

const state = ProjectState.getInstance();

new ProjectInput();

new ProjectList('active');

new ProjectList('finished');

export { state }