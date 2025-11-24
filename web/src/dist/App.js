"use strict";
exports.__esModule = true;
var react_router_dom_1 = require("react-router-dom");
var DropInContext_1 = require("./context/DropInContext");
var FiltersContext_1 = require("./context/FiltersContext");
var react_1 = require("react");
var DropIns_1 = require("./pages/DropIns");
var Locations_1 = require("./pages/Locations");
var CommunityCenter_1 = require("./pages/CommunityCenter");
var DropInProgram_1 = require("./pages/DropInProgram");
var UserProfile_1 = require("./pages/UserProfile");
var Login_1 = require("./pages/(auth)/Login");
var SignUp_1 = require("./pages/(auth)/SignUp");
var react_error_boundary_1 = require("react-error-boundary");
var ErrorScreen_1 = require("./components/errors/ErrorScreen");
var AuthContext_1 = require("./context/AuthContext");
var ProtectedRoutes_1 = require("./components/auth/ProtectedRoutes");
var lucide_react_1 = require("lucide-react");
var REACT_APP_SERVER_API = process.env.REACT_APP_SERVER_API || "localhost:3000";
function HomePage() {
    var _a = react_1.useState(""), query = _a[0], setQuery = _a[1];
    var navigate = react_router_dom_1.useNavigate();
    var handleSearch = function () {
        if (!query.trim())
            return;
        navigate("/dropins?sports=" + encodeURIComponent(query.trim()));
    };
    return (React.createElement("div", { className: "flex justify-center items-center h-full" },
        React.createElement("div", { className: "w-[60%]" },
            React.createElement("h3", { className: "text-black font-bold text-[50px] mb-[80px]" }, "What do you want to play today?"),
            React.createElement("div", { className: "flex items-center w-[60%]" },
                React.createElement("input", { placeholder: "Type a sport...", className: "w-[70%] h-[40px] px-3 border rounded", value: query, onChange: function (e) { return setQuery(e.target.value); }, onKeyDown: function (e) { return e.key === "Enter" && handleSearch(); } }),
                React.createElement("button", { className: "w-[30%] ml-5 bg-black text-white rounded-xl h-[40px]", onClick: handleSearch }, "Search")))));
}
var LoginButton = function () {
    var token = AuthContext_1.useAuth().token;
    console.log(token);
    return (React.createElement("div", null, token ?
        React.createElement(react_router_dom_1.Link, { to: "/profile", className: "text-sm font-bold" },
            React.createElement(lucide_react_1.User, null)) :
        React.createElement(react_router_dom_1.Link, { to: "/login" }, "Login")));
};
function App() {
    // Warm up server
    fetch(REACT_APP_SERVER_API).then(function () { return console.log("Server warmed up"); });
    return (React.createElement("div", { className: "h-screen bg-white flex flex-col" },
        React.createElement("title", null, "DropInToronto"),
        React.createElement(react_error_boundary_1.ErrorBoundary, { FallbackComponent: ErrorScreen_1.ErrorScreen, onReset: function () {
                // You can reset any state or navigation here
                // window.location.reload();
            } },
            React.createElement(AuthContext_1.AuthProvider, null,
                React.createElement(react_router_dom_1.BrowserRouter, null,
                    React.createElement("div", { className: "h-[8%] flex items-center justify-between bg-black" },
                        React.createElement("div", { className: "flex items-center gap-10 px-20 text-white" },
                            React.createElement(react_router_dom_1.Link, { to: "/", className: "font-bold text-xl" }, "DropInToronto"),
                            React.createElement(react_router_dom_1.Link, { to: "/dropins", className: "text-sm font-bold" }, "Dropins"),
                            React.createElement(react_router_dom_1.Link, { to: "/locations", className: "text-sm font-bold" }, "Locations")),
                        React.createElement("div", { className: "text-white flex items-center gap-10 px-5" },
                            React.createElement(LoginButton, null))),
                    React.createElement(FiltersContext_1.FilterProvider, null,
                        React.createElement(DropInContext_1.DropInsProvider, null,
                            React.createElement("div", { className: "h-[92%] flex-1 w-full" },
                                React.createElement(react_router_dom_1.Routes, null,
                                    React.createElement(react_router_dom_1.Route, { path: "/", element: React.createElement(HomePage, null) }),
                                    React.createElement(react_router_dom_1.Route, { path: "/dropins", element: React.createElement(DropIns_1["default"], null) }),
                                    React.createElement(react_router_dom_1.Route, { path: "/locations", element: React.createElement(Locations_1["default"], null) }),
                                    React.createElement(react_router_dom_1.Route, { path: "/locations/:communityCenterId", element: React.createElement(CommunityCenter_1["default"], null) }),
                                    React.createElement(react_router_dom_1.Route, { path: "/dropins/:dropInId", element: React.createElement(DropInProgram_1["default"], null) }),
                                    React.createElement(react_router_dom_1.Route, { path: "/login", element: React.createElement(Login_1["default"], null) }),
                                    React.createElement(react_router_dom_1.Route, { path: "/signup", element: React.createElement(SignUp_1["default"], null) }),
                                    React.createElement(react_router_dom_1.Route, { path: "/profile", element: React.createElement(ProtectedRoutes_1["default"], null,
                                            React.createElement(UserProfile_1["default"], null)) }))))))))));
}
exports["default"] = App;
