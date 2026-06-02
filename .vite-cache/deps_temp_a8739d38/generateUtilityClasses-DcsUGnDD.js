import { $ as generateUtilityClass } from "./styled-DHYvJPu7.js";
//#region node_modules/@mui/utils/generateUtilityClasses/generateUtilityClasses.mjs
function generateUtilityClasses(componentName, slots, globalStatePrefix = "Mui") {
	const result = {};
	slots.forEach((slot) => {
		result[slot] = generateUtilityClass(componentName, slot, globalStatePrefix);
	});
	return result;
}
//#endregion
export { generateUtilityClasses as t };

//# sourceMappingURL=generateUtilityClasses-DcsUGnDD.js.map