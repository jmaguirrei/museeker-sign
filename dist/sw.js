parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"NqYy":[function(require,module,exports) {
var e=["https://museeker.io","http://localhost"],t="v1",n=["./app.js","./index.html","https://fonts.googleapis.com/css?family=Source+Sans+Pro"];function c(t){return t.startsWith(e[0])||t.startsWith(e[1])?t.indexOf("/api/")>=0?"api":t.indexOf("/base-")>=0?"base":t.indexOf("/icons/")>=0||t.indexOf("/splash/")>=0?"image":"page":"external"}function a(e,t){var n="-".repeat(80-e.length);return t?console.log("[SW] ".concat(e," ").concat(n,"> "),t):console.log("[SW] ".concat(n,"> ").concat(e))}self.addEventListener("install",function(e){a("Installed"),e.waitUntil(self.caches.open(t).then(function(e){return e.addAll(n)}).catch(function(e){a("Install: Error",e)}))}),self.addEventListener("activate",function(e){a("Activated"),e.waitUntil(self.caches.keys().then(function(e){return Promise.all(e.map(function(e){if(e!==t)return a("Removing cached files from ",e),self.caches.delete(e)}))}).catch(function(e){a("Activate: Error",e)}))}),self.addEventListener("fetch",function(e){var n=e.request.url;a("Fetching",n);var i=c(n);a("RequestType",i),["page","api"].includes(i)?e.respondWith(self.fetch(e.request)):e.respondWith(self.caches.match(e.request).then(function(c){if(c)return a("Found in cache",n),c;var i=e.request.clone();self.fetch(i).then(function(n){if(!n)return a("No response from fetch"),n;var i=n.clone();self.caches.open(t).then(function(t){return t.put(e.request,i),c})}).catch(function(e){a("Error Fetching && Catching",e)})}).catch(function(e){a("Error Finding in cache",e)}))});
},{}]},{},["NqYy"], null)
//# sourceMappingURL=/sw.map