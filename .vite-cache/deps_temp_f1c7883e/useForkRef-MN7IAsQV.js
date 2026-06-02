import { i as __toESM, t as require_react } from "./react-BDWiK9rz.js";
import { J as useEnhancedEffect } from "./styled-DHYvJPu7.js";
import { t as useForkRef } from "./useForkRef-Dihj6Vao.js";
//#region node_modules/@mui/material/utils/useEnhancedEffect.mjs
var useEnhancedEffect_default = useEnhancedEffect;
//#endregion
//#region node_modules/@mui/utils/useEventCallback/useEventCallback.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Inspired by https://github.com/facebook/react/issues/14099#issuecomment-440013892
* See RFC in https://github.com/reactjs/rfcs/pull/220
*/
function useEventCallback(fn) {
	const ref = import_react.useRef(fn);
	useEnhancedEffect(() => {
		ref.current = fn;
	});
	return import_react.useRef((...args) => (0, ref.current)(...args)).current;
}
//#endregion
//#region node_modules/@mui/material/utils/useForkRef.mjs
var useForkRef_default = useForkRef;
//#endregion
export { useEventCallback as n, useEnhancedEffect_default as r, useForkRef_default as t };

//# sourceMappingURL=useForkRef-MN7IAsQV.js.map