import { o as __toESM } from "../_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-sGid3STf.mjs";
import { t as GROK_PROVIDERS } from "./server-f9H7eE7W.mjs";
import { n as useCurrentUserState } from "./use-current-user-DZ7NZd4-.mjs";
import { t as BrandMark } from "./brand-mark-B3tMQyky.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CWThkYW6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!isPending && user) navigate({ to: "/" });
	}, [
		isPending,
		user,
		navigate
	]);
	const onEmail = async (e) => {
		e.preventDefault();
		setErr(null);
		setBusy(true);
		try {
			if (mode === "up") {
				const res = await authClient.signUp.email({
					email,
					password,
					name: name || email.split("@")[0]
				});
				if (res.error) throw new Error(res.error.message);
			} else {
				const res = await authClient.signIn.email({
					email,
					password
				});
				if (res.error) throw new Error(res.error.message);
			}
			await navigate({ to: "/" });
		} catch (error) {
			setErr(error instanceof Error ? error.message : "Could not sign in");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-dvh bg-ink px-4 py-8 text-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 overflow-hidden border border-line bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/assets/card-urban.jpg",
						alt: "",
						className: "h-36 w-full object-cover object-top"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-4xl text-paper uppercase",
								children: "Sign in to claim"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-paper/70",
								children: "Play as a guest. Sign in when you are ready to collect a voucher or the golden pair."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 space-y-2",
								children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => void signIn(p.providerId, { callbackURL: "/" }),
									className: "h-11 w-full bg-paper text-sm font-semibold tracking-wide text-ink uppercase hover:bg-brand",
									children: ["Continue with ", p.label]
								}, p.providerId))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "my-5 flex items-center gap-3 text-xs tracking-[0.18em] text-muted uppercase",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" }),
									"or email",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (e) => void onEmail(e),
								className: "space-y-3",
								children: [
									mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-paper",
											children: "Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: name,
											onChange: (e) => setName(e.target.value),
											className: "mt-1 h-11 w-full bg-ink px-3 text-paper"
										})]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-paper",
											children: "Email"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "email",
											required: true,
											value: email,
											onChange: (e) => setEmail(e.target.value),
											className: "mt-1 h-11 w-full bg-ink px-3 text-paper"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-paper",
											children: "Password"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "password",
											required: true,
											minLength: 8,
											value: password,
											onChange: (e) => setPassword(e.target.value),
											className: "mt-1 h-11 w-full bg-ink px-3 text-paper"
										})]
									}),
									err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-brand",
										children: err
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: busy,
										className: "h-11 w-full bg-brand text-sm font-semibold tracking-wide text-ink uppercase disabled:opacity-60",
										children: busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in with email"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMode(mode === "up" ? "in" : "up"),
								className: "mt-3 w-full text-center text-sm text-paper/70 underline-offset-2 hover:text-brand hover:underline",
								children: mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-center text-xs text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "underline-offset-2 hover:underline",
						children: "Back to The Great Hop"
					})
				})
			]
		})
	});
}
//#endregion
export { Login as component };
