"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // src/common/ral.ts
  var _ral;
  function RAL() {
    if (_ral === void 0) {
      throw new Error(`No runtime abstraction layer installed`);
    }
    return _ral;
  }
  ((RAL2) => {
    function install(ral) {
      if (ral === void 0) {
        throw new Error(`No runtime abstraction layer provided`);
      }
      _ral = ral;
    }
    RAL2.install = install;
    function isInstalled() {
      return _ral !== void 0;
    }
    RAL2.isInstalled = isInstalled;
  })(RAL || (RAL = {}));
  var ral_default = RAL;

  // src/web/path.ts
  var path_exports = {};
  __export(path_exports, {
    basename: () => basename,
    delimiter: () => delimiter,
    dirname: () => dirname,
    extname: () => extname,
    isAbsolute: () => isAbsolute,
    join: () => join,
    normalize: () => normalize,
    posix: () => posix,
    sep: () => sep
  });
  var CHAR_DOT = 46;
  var CHAR_FORWARD_SLASH = 47;
  var ErrorInvalidArgType = class extends Error {
    constructor(name, expected, actual) {
      let determiner;
      if (typeof expected === "string" && expected.indexOf("not ") === 0) {
        determiner = "must not be";
        expected = expected.replace(/^not /, "");
      } else {
        determiner = "must be";
      }
      const type = name.indexOf(".") !== -1 ? "property" : "argument";
      let msg = `The "${name}" ${type} ${determiner} of type ${expected}`;
      msg += `. Received type ${typeof actual}`;
      super(msg);
      __publicField(this, "code");
      this.code = "ERR_INVALID_ARG_TYPE";
    }
  };
  function validateString(value, name) {
    if (typeof value !== "string") {
      throw new ErrorInvalidArgType(name, "string", value);
    }
  }
  function isPosixPathSeparator(code) {
    return code === CHAR_FORWARD_SLASH;
  }
  function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code = 0;
    for (let i = 0; i <= path.length; ++i) {
      if (i < path.length) {
        code = path.charCodeAt(i);
      } else if (isPathSeparator(code)) {
        break;
      } else {
        code = CHAR_FORWARD_SLASH;
      }
      if (isPathSeparator(code)) {
        if (lastSlash === i - 1 || dots === 1) {
        } else if (dots === 2) {
          if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
            if (res.length > 2) {
              const lastSlashIndex = res.lastIndexOf(separator);
              if (lastSlashIndex === -1) {
                res = "";
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
              }
              lastSlash = i;
              dots = 0;
              continue;
            } else if (res.length !== 0) {
              res = "";
              lastSegmentLength = 0;
              lastSlash = i;
              dots = 0;
              continue;
            }
          }
          if (allowAboveRoot) {
            res += res.length > 0 ? `${separator}..` : "..";
            lastSegmentLength = 2;
          }
        } else {
          if (res.length > 0) {
            res += `${separator}${path.slice(lastSlash + 1, i)}`;
          } else {
            res = path.slice(lastSlash + 1, i);
          }
          lastSegmentLength = i - lastSlash - 1;
        }
        lastSlash = i;
        dots = 0;
      } else if (code === CHAR_DOT && dots !== -1) {
        ++dots;
      } else {
        dots = -1;
      }
    }
    return res;
  }
  var posix = {
    normalize(path) {
      validateString(path, "path");
      if (path.length === 0) {
        return ".";
      }
      const isAbsolute2 = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      const trailingSeparator = path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;
      path = normalizeString(path, !isAbsolute2, "/", isPosixPathSeparator);
      if (path.length === 0) {
        if (isAbsolute2) {
          return "/";
        }
        return trailingSeparator ? "./" : ".";
      }
      if (trailingSeparator) {
        path += "/";
      }
      return isAbsolute2 ? `/${path}` : path;
    },
    isAbsolute(path) {
      validateString(path, "path");
      return path.length > 0 && path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    },
    join(...paths) {
      if (paths.length === 0) {
        return ".";
      }
      let joined;
      for (let i = 0; i < paths.length; ++i) {
        const arg = paths[i];
        validateString(arg, "path");
        if (arg.length > 0) {
          if (joined === void 0) {
            joined = arg;
          } else {
            joined += `/${arg}`;
          }
        }
      }
      if (joined === void 0) {
        return ".";
      }
      return posix.normalize(joined);
    },
    dirname(path) {
      validateString(path, "path");
      if (path.length === 0) {
        return ".";
      }
      const hasRoot = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
      let end = -1;
      let matchedSlash = true;
      for (let i = path.length - 1; i >= 1; --i) {
        if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          matchedSlash = false;
        }
      }
      if (end === -1) {
        return hasRoot ? "/" : ".";
      }
      if (hasRoot && end === 1) {
        return "//";
      }
      return path.slice(0, end);
    },
    basename(path, ext) {
      if (ext !== void 0) {
        validateString(ext, "ext");
      }
      validateString(path, "path");
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
        if (ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
          const code = path.charCodeAt(i);
          if (code === CHAR_FORWARD_SLASH) {
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  end = i;
                }
              } else {
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      }
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
      }
      if (end === -1) {
        return "";
      }
      return path.slice(start, end);
    },
    extname(path) {
      validateString(path, "path");
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      let preDotState = 0;
      for (let i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (code === CHAR_DOT) {
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
      }
      return path.slice(startDot, end);
    },
    sep: "/",
    delimiter: ":"
  };
  var normalize = posix.normalize;
  var isAbsolute = posix.isAbsolute;
  var join = posix.join;
  var dirname = posix.dirname;
  var basename = posix.basename;
  var extname = posix.extname;
  var sep = posix.sep;
  var delimiter = posix.delimiter;

  // src/web/ril.ts
  var encoder = new TextEncoder();
  var decoder = new TextDecoder();
  var _ril = Object.freeze({
    TextEncoder: Object.freeze({
      create(_encoding = "utf-8") {
        return encoder;
      }
    }),
    TextDecoder: Object.freeze({
      create(_encoding = "utf-8") {
        return {
          decode(input) {
            if (input === void 0) {
              return decoder.decode(input);
            } else {
              if (input.buffer instanceof SharedArrayBuffer) {
                return decoder.decode(input.slice(0));
              } else {
                return decoder.decode(input);
              }
            }
          }
        };
      }
    }),
    console,
    timer: Object.freeze({
      setTimeout(callback, ms, ...args) {
        const handle = setTimeout(callback, ms, ...args);
        return { dispose: () => clearTimeout(handle) };
      },
      setImmediate(callback, ...args) {
        const handle = setTimeout(callback, 0, ...args);
        return { dispose: () => clearTimeout(handle) };
      },
      setInterval(callback, ms, ...args) {
        const handle = setInterval(callback, ms, ...args);
        return { dispose: () => clearInterval(handle) };
      }
    }),
    clock: Object.freeze({
      realtime() {
        return BigInt(Date.now()) * 1000000n;
      },
      monotonic() {
        const now = self.performance.timeOrigin + self.performance.now();
        const ms = Math.trunc(now);
        const msf = now - ms;
        return BigInt(ms) * 1000000n + BigInt(Math.round(msf * 1e6));
      }
    }),
    crypto: Object.freeze({
      randomGet(size) {
        const result = new Uint8Array(size);
        self.crypto.getRandomValues(result);
        return result;
      }
    }),
    path: path_exports,
    workbench: Object.freeze({
      hasTrash: false
    })
  });
  function RIL() {
    return _ril;
  }
  ((RIL2) => {
    function install() {
      if (!ral_default.isInstalled()) {
        ral_default.install(_ril);
      }
    }
    RIL2.install = install;
  })(RIL || (RIL = {}));
  if (!ral_default.isInstalled()) {
    ral_default.install(_ril);
  }
  var ril_default = RIL;

  // src/common/wasiMeta.ts
  var ptr_size = 4;
  var PtrParam = { kind: 1 /* ptr */, size: ptr_size, write: (view, offset, value) => view.setUint32(offset, value, true), read: (view, offset) => view.getUint32(offset, true) };
  var WasiFunctionSignature;
  ((WasiFunctionSignature3) => {
    function create(params) {
      return {
        params,
        memorySize: getMemorySize(params)
      };
    }
    WasiFunctionSignature3.create = create;
    function getMemorySize(params) {
      let result = 0;
      for (const param of params) {
        result += param.size;
      }
      return result;
    }
  })(WasiFunctionSignature || (WasiFunctionSignature = {}));
  var ArgumentsTransfer;
  ((ArgumentsTransfer2) => {
    ArgumentsTransfer2.Null = {
      items: [],
      size: 0
    };
    function create(items) {
      return {
        items,
        size: getMemorySize(items)
      };
    }
    ArgumentsTransfer2.create = create;
    function getMemorySize(transfers) {
      let result = 0;
      for (const transfer of transfers) {
        result += transfer.memorySize;
      }
      return result;
    }
  })(ArgumentsTransfer || (ArgumentsTransfer = {}));
  var MemoryTransfer;
  ((MemoryTransfer2) => {
    function isCustom(transfer) {
      const candidate = transfer;
      return candidate && typeof candidate.copy === "function" && typeof candidate.size === "number";
    }
    MemoryTransfer2.isCustom = isCustom;
    function isArguments(transfer) {
      const candidate = transfer;
      return candidate && Array.isArray(candidate.items) && typeof candidate.size === "number";
    }
    MemoryTransfer2.isArguments = isArguments;
  })(MemoryTransfer || (MemoryTransfer = {}));
  var ReverseTransfer;
  ((ReverseTransfer2) => {
    function isCustom(transfer) {
      const candidate = transfer;
      return candidate && typeof candidate.copy === "function";
    }
    ReverseTransfer2.isCustom = isCustom;
    function isArguments(transfer) {
      const candidate = transfer;
      return candidate && Array.isArray(candidate);
    }
    ReverseTransfer2.isArguments = isArguments;
  })(ReverseTransfer || (ReverseTransfer = {}));
  var _WasiFunctions;
  ((_WasiFunctions2) => {
    const callbacks = [];
    const name2Index = /* @__PURE__ */ new Map();
    const index2Name = /* @__PURE__ */ new Map();
    function functionAt(index) {
      if (index >= callbacks.length) {
        throw new Error("Should never happen");
      }
      return callbacks[index];
    }
    _WasiFunctions2.functionAt = functionAt;
    function get(name) {
      const index = name2Index.get(name);
      if (index === void 0) {
        throw new Error("Should never happen");
      }
      return callbacks[index];
    }
    _WasiFunctions2.get = get;
    function getIndex(name) {
      const result = name2Index.get(name);
      if (result === void 0) {
        throw new Error("Should never happen");
      }
      return result;
    }
    _WasiFunctions2.getIndex = getIndex;
    function getName(index) {
      const result = index2Name.get(index);
      if (result === void 0) {
        throw new Error("Should never happen");
      }
      return result;
    }
    _WasiFunctions2.getName = getName;
    function add(wasiFunction) {
      const index = callbacks.length;
      callbacks.push(wasiFunction);
      name2Index.set(wasiFunction.name, index);
      index2Name.set(index, wasiFunction.name);
    }
    _WasiFunctions2.add = add;
  })(_WasiFunctions || (_WasiFunctions = {}));
  var WasiFunctions = _WasiFunctions;
  var U8;
  ((U82) => {
    U82.size = 1;
    U82.$ptr = PtrParam;
    U82.$param = { kind: 2 /* number */, size: U82.size, write: (view, offset, value) => view.setUint8(offset, value), read: (view, offset) => view.getUint8(offset) };
  })(U8 || (U8 = {}));
  var Byte = U8;
  var Bytes;
  ((Bytes2) => {
    Bytes2.$ptr = PtrParam;
    function createTransfer(length, direction) {
      return {
        memorySize: length,
        copy: (wasmMemory, from, transferMemory, to) => {
          if (direction === 1 /* param */ || direction === 3 /* both */) {
            new Uint8Array(transferMemory, to, length).set(new Uint8Array(wasmMemory, from, length));
          }
          return direction === 1 /* param */ ? void 0 : { from: to, to: from, size: length };
        }
      };
    }
    Bytes2.createTransfer = createTransfer;
  })(Bytes || (Bytes = {}));
  var U16;
  ((U162) => {
    U162.size = 2;
    U162.$ptr = PtrParam;
    U162.$param = { kind: 2 /* number */, size: U162.size, write: (view, offset, value) => view.setUint16(offset, value, true), read: (view, offset) => view.getUint16(offset, true) };
  })(U16 || (U16 = {}));
  var U32;
  ((U322) => {
    U322.size = 4;
    U322.$ptr = PtrParam;
    U322.$param = { kind: 2 /* number */, size: U322.size, write: (view, offset, value) => view.setUint32(offset, value, true), read: (view, offset) => view.getUint32(offset, true) };
    U322.$transfer = {
      memorySize: U322.size,
      copy: (_wasmMemory, from, _transferMemory, to) => {
        return { from: to, to: from, size: U322.size };
      }
    };
  })(U32 || (U32 = {}));
  var Size = U32;
  var U64;
  ((U642) => {
    U642.size = 8;
    U642.$ptr = PtrParam;
    U642.$param = { kind: 3 /* bigint */, size: U642.size, write: (view, offset, value) => view.setBigUint64(offset, value, true), read: (view, offset) => view.getBigUint64(offset, true) };
    U642.$transfer = {
      memorySize: U642.size,
      copy: (_wasmMemory, from, _transferMemory, to) => {
        return { from: to, to: from, size: U642.size };
      }
    };
  })(U64 || (U64 = {}));
  var S64;
  ((S642) => {
    S642.size = 8;
    S642.$ptr = PtrParam;
    S642.$param = { kind: 3 /* bigint */, size: S642.size, write: (view, offset, value) => view.setBigInt64(offset, value, true), read: (view, offset) => view.getBigInt64(offset, true) };
  })(S64 || (S64 = {}));
  var Ptr;
  ((Ptr2) => {
    Ptr2.size = 4;
    Ptr2.$param = PtrParam;
    function createTransfer(length, direction) {
      return {
        memorySize: length * Ptr2.size,
        copy: (wasmMemory, from, transferMemory, to) => {
          if (direction === 1 /* param */ || direction === 3 /* both */) {
            new Uint8Array(transferMemory, to, Ptr2.size).set(new Uint8Array(wasmMemory, from, Ptr2.size));
          }
          return direction === 1 /* param */ ? void 0 : { from: to, to: from, size: Ptr2.size };
        }
      };
    }
    Ptr2.createTransfer = createTransfer;
  })(Ptr || (Ptr = {}));

  // src/common/wasi.ts
  var StructArray = class {
    constructor(memory, ptr, len, struct) {
      __publicField(this, "memory");
      __publicField(this, "ptr");
      __publicField(this, "len");
      __publicField(this, "struct");
      this.memory = memory;
      this.ptr = ptr;
      this.len = len;
      this.struct = struct;
    }
    [Symbol.iterator]() {
      return this.values();
    }
    values() {
      let index = 0;
      const result = {
        [Symbol.iterator]: () => {
          return result;
        },
        next: () => {
          if (index >= this.len) {
            return { done: true, value: void 0 };
          } else {
            return { done: false, value: this.struct.create(this.memory, this.ptr + index++ * this.struct.size) };
          }
        }
      };
      return result;
    }
    get(index) {
      if (index < 0 || index >= this.len) {
        throw new WasiError(Errno.inval);
      }
      return this.struct.create(this.memory, this.ptr + index * this.struct.size);
    }
  };
  var PointerArray = class {
    constructor(memory, ptr, len) {
      __publicField(this, "memory");
      __publicField(this, "ptr");
      __publicField(this, "len");
      this.memory = memory;
      this.ptr = ptr;
      this.len = len;
    }
    get(index) {
      if (index < 0 || index >= this.len) {
        throw new WasiError(Errno.inval);
      }
      return this.memory.getUint32(this.ptr + index * 4, true);
    }
    set(index, value) {
      if (index < 0 || index >= this.len) {
        throw new WasiError(Errno.inval);
      }
      this.memory.setUint32(this.ptr + index * 4, value, true);
    }
    [Symbol.iterator]() {
      return this.values();
    }
    values() {
      let index = 0;
      const result = {
        [Symbol.iterator]: () => {
          return result;
        },
        next: () => {
          if (index >= this.len) {
            return { done: true, value: void 0 };
          } else {
            return { done: false, value: this.memory.getUint32(this.ptr + index++ * 4, true) };
          }
        }
      };
      return result;
    }
  };
  var Fd;
  ((Fd2) => {
    Fd2.$param = U32.$param;
    Fd2.$ptr = Ptr.$param;
    Fd2.$transfer = U32.$transfer;
  })(Fd || (Fd = {}));
  var Exitcode;
  ((Exitcode2) => {
    Exitcode2.$param = U32.$param;
  })(Exitcode || (Exitcode = {}));
  var Errno;
  ((Errno2) => {
    Errno2.success = 0;
    Errno2.toobig = 1;
    Errno2.acces = 2;
    Errno2.addrinuse = 3;
    Errno2.addrnotavail = 4;
    Errno2.afnosupport = 5;
    Errno2.again = 6;
    Errno2.already = 7;
    Errno2.badf = 8;
    Errno2.badmsg = 9;
    Errno2.busy = 10;
    Errno2.canceled = 11;
    Errno2.child = 12;
    Errno2.connaborted = 13;
    Errno2.connrefused = 14;
    Errno2.connreset = 15;
    Errno2.deadlk = 16;
    Errno2.destaddrreq = 17;
    Errno2.dom = 18;
    Errno2.dquot = 19;
    Errno2.exist = 20;
    Errno2.fault = 21;
    Errno2.fbig = 22;
    Errno2.hostunreach = 23;
    Errno2.idrm = 24;
    Errno2.ilseq = 25;
    Errno2.inprogress = 26;
    Errno2.intr = 27;
    Errno2.inval = 28;
    Errno2.io = 29;
    Errno2.isconn = 30;
    Errno2.isdir = 31;
    Errno2.loop = 32;
    Errno2.mfile = 33;
    Errno2.mlink = 34;
    Errno2.msgsize = 35;
    Errno2.multihop = 36;
    Errno2.nametoolong = 37;
    Errno2.netdown = 38;
    Errno2.netreset = 39;
    Errno2.netunreach = 40;
    Errno2.nfile = 41;
    Errno2.nobufs = 42;
    Errno2.nodev = 43;
    Errno2.noent = 44;
    Errno2.noexec = 45;
    Errno2.nolck = 46;
    Errno2.nolink = 47;
    Errno2.nomem = 48;
    Errno2.nomsg = 49;
    Errno2.noprotoopt = 50;
    Errno2.nospc = 51;
    Errno2.nosys = 52;
    Errno2.notconn = 53;
    Errno2.notdir = 54;
    Errno2.notempty = 55;
    Errno2.notrecoverable = 56;
    Errno2.notsock = 57;
    Errno2.notsup = 58;
    Errno2.notty = 59;
    Errno2.nxio = 60;
    Errno2.overflow = 61;
    Errno2.ownerdead = 62;
    Errno2.perm = 63;
    Errno2.pipe = 64;
    Errno2.proto = 65;
    Errno2.protonosupport = 66;
    Errno2.prototype = 67;
    Errno2.range = 68;
    Errno2.rofs = 69;
    Errno2.spipe = 70;
    Errno2.srch = 71;
    Errno2.stale = 72;
    Errno2.timedout = 73;
    Errno2.txtbsy = 74;
    Errno2.xdev = 75;
    Errno2.notcapable = 76;
    function toString(value) {
      switch (value) {
        case Errno2.success:
          return "success";
        case Errno2.toobig:
          return "toobig";
        case Errno2.acces:
          return "acces";
        case Errno2.addrinuse:
          return "addrinuse";
        case Errno2.addrnotavail:
          return "addrnotavail";
        case Errno2.afnosupport:
          return "afnosupport";
        case Errno2.again:
          return "again";
        case Errno2.already:
          return "already";
        case Errno2.badf:
          return "badf";
        case Errno2.badmsg:
          return "badmsg";
        case Errno2.busy:
          return "busy";
        case Errno2.canceled:
          return "canceled";
        case Errno2.child:
          return "child";
        case Errno2.connaborted:
          return "connaborted";
        case Errno2.connrefused:
          return "connrefused";
        case Errno2.connreset:
          return "connreset";
        case Errno2.deadlk:
          return "deadlk";
        case Errno2.destaddrreq:
          return "destaddrreq";
        case Errno2.dom:
          return "dom";
        case Errno2.dquot:
          return "dquot";
        case Errno2.exist:
          return "exist";
        case Errno2.fault:
          return "fault";
        case Errno2.fbig:
          return "fbig";
        case Errno2.hostunreach:
          return "hostunreach";
        case Errno2.idrm:
          return "idrm";
        case Errno2.ilseq:
          return "ilseq";
        case Errno2.inprogress:
          return "inprogress";
        case Errno2.intr:
          return "intr";
        case Errno2.inval:
          return "inval";
        case Errno2.io:
          return "io";
        case Errno2.isconn:
          return "isconn";
        case Errno2.isdir:
          return "isdir";
        case Errno2.loop:
          return "loop";
        case Errno2.mfile:
          return "mfile";
        case Errno2.mlink:
          return "mlink";
        case Errno2.msgsize:
          return "msgsize";
        case Errno2.multihop:
          return "multihop";
        case Errno2.nametoolong:
          return "nametoolong";
        case Errno2.netdown:
          return "netdown";
        case Errno2.netreset:
          return "netreset";
        case Errno2.netunreach:
          return "netunreach";
        case Errno2.nfile:
          return "nfile";
        case Errno2.nobufs:
          return "nobufs";
        case Errno2.nodev:
          return "nodev";
        case Errno2.noent:
          return "noent";
        case Errno2.noexec:
          return "noexec";
        case Errno2.nolck:
          return "nolck";
        case Errno2.nolink:
          return "nolink";
        case Errno2.nomem:
          return "nomem";
        case Errno2.nomsg:
          return "nomsg";
        case Errno2.noprotoopt:
          return "noprotoopt";
        case Errno2.nospc:
          return "nospc";
        case Errno2.nosys:
          return "nosys";
        case Errno2.notconn:
          return "notconn";
        case Errno2.notdir:
          return "notdir";
        case Errno2.notempty:
          return "notempty";
        case Errno2.notrecoverable:
          return "notrecoverable";
        case Errno2.notsock:
          return "notsock";
        case Errno2.notsup:
          return "notsup";
        case Errno2.notty:
          return "notty";
        case Errno2.nxio:
          return "nxio";
        case Errno2.overflow:
          return "overflow";
        case Errno2.ownerdead:
          return "ownerdead";
        case Errno2.perm:
          return "perm";
        case Errno2.pipe:
          return "pipe";
        case Errno2.proto:
          return "proto";
        case Errno2.protonosupport:
          return "protonosupport";
        case Errno2.prototype:
          return "prototype";
        case Errno2.range:
          return "range";
        case Errno2.rofs:
          return "rofs";
        case Errno2.spipe:
          return "spipe";
        case Errno2.srch:
          return "srch";
        case Errno2.stale:
          return "stale";
        case Errno2.timedout:
          return "timedout";
        case Errno2.txtbsy:
          return "txtbsy";
        case Errno2.xdev:
          return "xdev";
        case Errno2.notcapable:
          return "notcapable";
        default:
          return value.toString();
      }
    }
    Errno2.toString = toString;
  })(Errno || (Errno = {}));
  var WasiError = class extends Error {
    constructor(errno3) {
      super();
      __publicField(this, "errno");
      this.errno = errno3;
    }
  };
  var Rights;
  ((Rights2) => {
    Rights2.fd_datasync = 1n << 0n;
    Rights2.fd_read = 1n << 1n;
    Rights2.fd_seek = 1n << 2n;
    Rights2.fd_fdstat_set_flags = 1n << 3n;
    Rights2.fd_sync = 1n << 4n;
    Rights2.fd_tell = 1n << 5n;
    Rights2.fd_write = 1n << 6n;
    Rights2.fd_advise = 1n << 7n;
    Rights2.fd_allocate = 1n << 8n;
    Rights2.path_create_directory = 1n << 9n;
    Rights2.path_create_file = 1n << 10n;
    Rights2.path_link_source = 1n << 11n;
    Rights2.path_link_target = 1n << 12n;
    Rights2.path_open = 1n << 13n;
    Rights2.fd_readdir = 1n << 14n;
    Rights2.path_readlink = 1n << 15n;
    Rights2.path_rename_source = 1n << 16n;
    Rights2.path_rename_target = 1n << 17n;
    Rights2.path_filestat_get = 1n << 18n;
    Rights2.path_filestat_set_size = 1n << 19n;
    Rights2.path_filestat_set_times = 1n << 20n;
    Rights2.fd_filestat_get = 1n << 21n;
    Rights2.fd_filestat_set_size = 1n << 22n;
    Rights2.fd_filestat_set_times = 1n << 23n;
    Rights2.path_symlink = 1n << 24n;
    Rights2.path_remove_directory = 1n << 25n;
    Rights2.path_unlink_file = 1n << 26n;
    Rights2.poll_fd_readwrite = 1n << 27n;
    Rights2.sock_shutdown = 1n << 28n;
    Rights2.sock_accept = 1n << 29n;
    function contains(rights3, check) {
      return (rights3 & check) === check;
    }
    Rights2.contains = contains;
    function supportFdflags(rights3, fdflags3) {
      if (fdflags3 === Fdflags.none) {
        return true;
      }
      if (Fdflags.dsyncOn(fdflags3)) {
        return contains(rights3, Rights2.fd_datasync | Rights2.fd_sync);
      }
      if (Fdflags.rsyncOn(fdflags3)) {
        return contains(rights3, Rights2.fd_sync);
      }
      return true;
    }
    Rights2.supportFdflags = supportFdflags;
    function supportOflags(rights3, oflags3) {
      if (oflags3 === Oflags.none) {
        return true;
      }
      if (Oflags.creatOn(oflags3)) {
        return contains(rights3, Rights2.path_create_file);
      }
      if (Oflags.truncOn(oflags3)) {
        return contains(rights3, Rights2.path_filestat_set_size);
      }
      return true;
    }
    Rights2.supportOflags = supportOflags;
    Rights2.None = 0n;
    Rights2.All = Rights2.fd_datasync | Rights2.fd_read | Rights2.fd_seek | Rights2.fd_fdstat_set_flags | Rights2.fd_sync | Rights2.fd_tell | Rights2.fd_write | Rights2.fd_advise | Rights2.fd_allocate | Rights2.path_create_directory | Rights2.path_create_file | Rights2.path_link_source | Rights2.path_link_target | Rights2.path_open | Rights2.fd_readdir | Rights2.path_readlink | Rights2.path_rename_source | Rights2.path_rename_target | Rights2.path_filestat_get | Rights2.path_filestat_set_size | Rights2.path_filestat_set_times | Rights2.fd_filestat_get | Rights2.fd_filestat_set_size | Rights2.fd_filestat_set_times | Rights2.path_symlink | Rights2.path_remove_directory | Rights2.path_unlink_file | Rights2.poll_fd_readwrite | Rights2.sock_shutdown | Rights2.sock_accept;
    Rights2.ReadOnly = Rights2.fd_read | Rights2.fd_seek | Rights2.fd_tell | Rights2.path_open | Rights2.fd_readdir | Rights2.path_readlink | Rights2.path_filestat_get | Rights2.fd_filestat_get | Rights2.poll_fd_readwrite;
    function toString(value) {
      const parts = [];
      if (contains(value, Rights2.fd_datasync)) {
        parts.push("fd_datasync");
      }
      if (contains(value, Rights2.fd_read)) {
        parts.push("fd_read");
      }
      if (contains(value, Rights2.fd_seek)) {
        parts.push("fd_seek");
      }
      if (contains(value, Rights2.fd_fdstat_set_flags)) {
        parts.push("fd_fdstat_set_flags");
      }
      if (contains(value, Rights2.fd_sync)) {
        parts.push("fd_sync");
      }
      if (contains(value, Rights2.fd_tell)) {
        parts.push("fd_tell");
      }
      if (contains(value, Rights2.fd_write)) {
        parts.push("fd_write");
      }
      if (contains(value, Rights2.fd_advise)) {
        parts.push("fd_advise");
      }
      if (contains(value, Rights2.fd_allocate)) {
        parts.push("fd_allocate");
      }
      if (contains(value, Rights2.path_create_directory)) {
        parts.push("path_create_directory");
      }
      if (contains(value, Rights2.path_create_file)) {
        parts.push("path_create_file");
      }
      if (contains(value, Rights2.path_link_source)) {
        parts.push("path_link_source");
      }
      if (contains(value, Rights2.path_link_target)) {
        parts.push("path_link_target");
      }
      if (contains(value, Rights2.path_open)) {
        parts.push("path_open");
      }
      if (contains(value, Rights2.fd_readdir)) {
        parts.push("fd_readdir");
      }
      if (contains(value, Rights2.path_readlink)) {
        parts.push("path_readlink");
      }
      if (contains(value, Rights2.path_rename_source)) {
        parts.push("path_rename_source");
      }
      if (contains(value, Rights2.path_rename_target)) {
        parts.push("path_rename_target");
      }
      if (contains(value, Rights2.path_filestat_get)) {
        parts.push("path_filestat_get");
      }
      if (contains(value, Rights2.path_filestat_set_size)) {
        parts.push("path_filestat_set_size");
      }
      if (contains(value, Rights2.path_filestat_set_times)) {
        parts.push("path_filestat_set_times");
      }
      if (contains(value, Rights2.fd_filestat_get)) {
        parts.push("fd_filestat_get");
      }
      if (contains(value, Rights2.fd_filestat_set_size)) {
        parts.push("fd_filestat_set_size");
      }
      if (contains(value, Rights2.fd_filestat_set_times)) {
        parts.push("fd_filestat_set_times");
      }
      if (contains(value, Rights2.path_symlink)) {
        parts.push("path_symlink");
      }
      if (contains(value, Rights2.path_remove_directory)) {
        parts.push("path_remove_directory");
      }
      if (contains(value, Rights2.path_unlink_file)) {
        parts.push("path_unlink_file");
      }
      if (contains(value, Rights2.poll_fd_readwrite)) {
        parts.push("poll_fd_readwrite");
      }
      if (contains(value, Rights2.sock_shutdown)) {
        parts.push("sock_shutdown");
      }
      if (contains(value, Rights2.sock_accept)) {
        parts.push("sock_accept");
      }
      if (parts.length === 0) {
        return "none";
      }
      return parts.join(" | ");
    }
    Rights2.toString = toString;
  })(Rights || (Rights = {}));
  ((Rights2) => {
    Rights2.$param = U64.$param;
  })(Rights || (Rights = {}));
  var Dircookie;
  ((Dircookie2) => {
    Dircookie2.$param = U64.$param;
  })(Dircookie || (Dircookie = {}));
  var Fdflags;
  ((Fdflags2) => {
    Fdflags2.none = 0;
    Fdflags2.append = 1 << 0;
    function appendOn(value) {
      return (value & Fdflags2.append) !== 0;
    }
    Fdflags2.appendOn = appendOn;
    Fdflags2.dsync = 1 << 1;
    function dsyncOn(value) {
      return (value & Fdflags2.dsync) !== 0;
    }
    Fdflags2.dsyncOn = dsyncOn;
    Fdflags2.nonblock = 1 << 2;
    function nonblockOn(value) {
      return (value & Fdflags2.nonblock) !== 0;
    }
    Fdflags2.nonblockOn = nonblockOn;
    Fdflags2.rsync = 1 << 3;
    function rsyncOn(value) {
      return (value & Fdflags2.rsync) !== 0;
    }
    Fdflags2.rsyncOn = rsyncOn;
    Fdflags2.sync = 1 << 4;
    function syncOn(value) {
      return (value & Fdflags2.sync) !== 0;
    }
    Fdflags2.syncOn = syncOn;
    function toString(value) {
      const parts = [];
      if (appendOn(value)) {
        parts.push("append");
      }
      if (dsyncOn(value)) {
        parts.push("dsync");
      }
      if (nonblockOn(value)) {
        parts.push("nonblock");
      }
      if (rsyncOn(value)) {
        parts.push("rsync");
      }
      if (syncOn(value)) {
        parts.push("sync");
      }
      if (parts.length === 0) {
        return "none";
      }
      return parts.join(" | ");
    }
    Fdflags2.toString = toString;
  })(Fdflags || (Fdflags = {}));
  ((Fdflags2) => {
    Fdflags2.$param = U16.$param;
  })(Fdflags || (Fdflags = {}));
  var Lookupflags;
  ((Lookupflags2) => {
    Lookupflags2.none = 0;
    Lookupflags2.symlink_follow = 1 << 0;
    function symlink_followOn(value) {
      return (value & Lookupflags2.symlink_follow) !== 0;
    }
    Lookupflags2.symlink_followOn = symlink_followOn;
    function toString(value) {
      const parts = [];
      if (symlink_followOn(value)) {
        parts.push("symlink_follow");
      }
      if (parts.length === 0) {
        return "none";
      }
      return parts.join(" | ");
    }
    Lookupflags2.toString = toString;
  })(Lookupflags || (Lookupflags = {}));
  ((Lookupflags2) => {
    Lookupflags2.$param = U32.$param;
  })(Lookupflags || (Lookupflags = {}));
  var Oflags;
  ((Oflags2) => {
    Oflags2.none = 0;
    Oflags2.creat = 1 << 0;
    function creatOn(value) {
      return (value & Oflags2.creat) !== 0;
    }
    Oflags2.creatOn = creatOn;
    function creatOff(value) {
      return (value & Oflags2.creat) === 0;
    }
    Oflags2.creatOff = creatOff;
    Oflags2.directory = 1 << 1;
    function directoryOn(value) {
      return (value & Oflags2.directory) !== 0;
    }
    Oflags2.directoryOn = directoryOn;
    Oflags2.excl = 1 << 2;
    function exclOn(value) {
      return (value & Oflags2.excl) !== 0;
    }
    Oflags2.exclOn = exclOn;
    Oflags2.trunc = 1 << 3;
    function truncOn(value) {
      return (value & Oflags2.trunc) !== 0;
    }
    Oflags2.truncOn = truncOn;
    function toString(value) {
      const parts = [];
      if (creatOn(value)) {
        parts.push("creat");
      }
      if (directoryOn(value)) {
        parts.push("directory");
      }
      if (exclOn(value)) {
        parts.push("excl");
      }
      if (truncOn(value)) {
        parts.push("trunc");
      }
      if (parts.length === 0) {
        parts.push("none");
      }
      return parts.join(" | ");
    }
    Oflags2.toString = toString;
  })(Oflags || (Oflags = {}));
  ((Oflags2) => {
    Oflags2.$param = U16.$param;
  })(Oflags || (Oflags = {}));
  var Clockid;
  ((Clockid2) => {
    Clockid2.realtime = 0;
    Clockid2.monotonic = 1;
    Clockid2.process_cputime_id = 2;
    Clockid2.thread_cputime_id = 3;
    function toString(value) {
      switch (value) {
        case Clockid2.realtime:
          return "realtime";
        case Clockid2.monotonic:
          return "monotonic";
        case Clockid2.process_cputime_id:
          return "process_cputime_id";
        case Clockid2.thread_cputime_id:
          return "thread_cputime_id";
        default:
          return value.toString();
      }
    }
    Clockid2.toString = toString;
  })(Clockid || (Clockid = {}));
  ((Clockid2) => {
    Clockid2.$param = U32.$param;
    Clockid2.$transfer = U32.$transfer;
  })(Clockid || (Clockid = {}));
  var Preopentype;
  ((Preopentype2) => {
    Preopentype2.dir = 0;
  })(Preopentype || (Preopentype = {}));
  var Filetype;
  ((Filetype2) => {
    Filetype2.unknown = 0;
    Filetype2.block_device = 1;
    Filetype2.character_device = 2;
    Filetype2.directory = 3;
    Filetype2.regular_file = 4;
    Filetype2.socket_dgram = 5;
    Filetype2.socket_stream = 6;
    Filetype2.symbolic_link = 7;
    function toString(value) {
      switch (value) {
        case Filetype2.unknown:
          return "unknown";
        case Filetype2.block_device:
          return "block_device";
        case Filetype2.character_device:
          return "character_device";
        case Filetype2.directory:
          return "directory";
        case Filetype2.regular_file:
          return "regular_file";
        case Filetype2.socket_dgram:
          return "socket_dgram";
        case Filetype2.socket_stream:
          return "socket_stream";
        case Filetype2.symbolic_link:
          return "symbolic_link";
        default:
          return value.toString();
      }
    }
    Filetype2.toString = toString;
  })(Filetype || (Filetype = {}));
  var Advise;
  ((Advise2) => {
    Advise2.normal = 0;
    Advise2.sequential = 1;
    Advise2.random = 2;
    Advise2.willneed = 3;
    Advise2.dontneed = 4;
    Advise2.noreuse = 5;
    function toString(value) {
      switch (value) {
        case Advise2.normal:
          return "normal";
        case Advise2.sequential:
          return "sequential";
        case Advise2.random:
          return "random";
        case Advise2.willneed:
          return "willneed";
        case Advise2.dontneed:
          return "dontneed";
        case Advise2.noreuse:
          return "noreuse";
        default:
          return value.toString();
      }
    }
    Advise2.toString = toString;
  })(Advise || (Advise = {}));
  ((Advise2) => {
    Advise2.$ptr = U8.$ptr;
    Advise2.$param = U8.$param;
  })(Advise || (Advise = {}));
  var Filesize;
  ((Filesize2) => {
    Filesize2.$ptr = Ptr.$param;
    Filesize2.$param = U64.$param;
    Filesize2.$transfer = U64.$transfer;
  })(Filesize || (Filesize = {}));
  var Timestamp;
  ((Timestamp2) => {
    Timestamp2.$ptr = Ptr.$param;
    Timestamp2.$param = U64.$param;
    Timestamp2.$transfer = U64.$transfer;
  })(Timestamp || (Timestamp = {}));
  var Filestat;
  ((Filestat2) => {
    Filestat2.size = 64;
    const offsets = {
      dev: 0,
      ino: 8,
      filetype: 16,
      nlink: 24,
      size: 32,
      atim: 40,
      mtim: 48,
      ctim: 56
    };
    function create(memory, ptr) {
      return {
        get $ptr() {
          return ptr;
        },
        get dev() {
          return memory.getBigUint64(ptr + offsets.dev, true);
        },
        set dev(value) {
          memory.setBigUint64(ptr + offsets.dev, value, true);
        },
        get ino() {
          return memory.getBigUint64(ptr + offsets.ino, true);
        },
        set ino(value) {
          memory.setBigUint64(ptr + offsets.ino, value, true);
        },
        get filetype() {
          return memory.getUint8(ptr + offsets.filetype);
        },
        set filetype(value) {
          memory.setUint8(ptr + offsets.filetype, value);
        },
        get nlink() {
          return memory.getBigUint64(ptr + offsets.nlink, true);
        },
        set nlink(value) {
          memory.setBigUint64(ptr + offsets.nlink, value, true);
        },
        get size() {
          return memory.getBigUint64(ptr + offsets.size, true);
        },
        set size(value) {
          memory.setBigUint64(ptr + offsets.size, value, true);
        },
        get atim() {
          return memory.getBigUint64(ptr + offsets.atim, true);
        },
        set atim(value) {
          memory.setBigUint64(ptr + offsets.atim, value, true);
        },
        get mtim() {
          return memory.getBigUint64(ptr + offsets.mtim, true);
        },
        set mtim(value) {
          memory.setBigUint64(ptr + offsets.mtim, value, true);
        },
        get ctim() {
          return memory.getBigUint64(ptr + offsets.ctim, true);
        },
        set ctim(value) {
          memory.setBigUint64(ptr + offsets.ctim, value, true);
        }
      };
    }
    Filestat2.create = create;
    function createHeap() {
      return {
        get $ptr() {
          throw new WasiError(Errno.inval);
        },
        dev: 0n,
        ino: 0n,
        filetype: Filetype.unknown,
        nlink: 0n,
        size: 0n,
        atim: 0n,
        mtim: 0n,
        ctim: 0n
      };
    }
    Filestat2.createHeap = createHeap;
  })(Filestat || (Filestat = {}));
  ((Filestat2) => {
    Filestat2.$ptr = Ptr.$param;
    Filestat2.$transfer = Bytes.createTransfer(Filestat2.size, 2 /* result */);
  })(Filestat || (Filestat = {}));
  var Filedelta;
  ((Filedelta2) => {
    Filedelta2.$param = S64.$param;
  })(Filedelta || (Filedelta = {}));
  var Whence;
  ((Whence2) => {
    Whence2.set = 0;
    Whence2.cur = 1;
    Whence2.end = 2;
    function toString(value) {
      switch (value) {
        case Whence2.set:
          return "set";
        case Whence2.cur:
          return "cur";
        case Whence2.end:
          return "end";
        default:
          return value.toString();
      }
    }
    Whence2.toString = toString;
  })(Whence || (Whence = {}));
  ((Whence2) => {
    Whence2.$param = U8.$param;
  })(Whence || (Whence = {}));
  var Fdstat;
  ((Fdstat2) => {
    Fdstat2.size = 24;
    Fdstat2.alignment = 8;
    const offsets = {
      fs_filetype: 0,
      fs_flags: 2,
      fs_rights_base: 8,
      fs_rights_inheriting: 16
    };
    function create(memory, ptr) {
      return {
        get $ptr() {
          return ptr;
        },
        get fs_filetype() {
          return memory.getUint8(ptr + offsets.fs_filetype);
        },
        set fs_filetype(value) {
          memory.setUint8(ptr + offsets.fs_filetype, value);
        },
        get fs_flags() {
          return memory.getUint16(ptr + offsets.fs_flags, true);
        },
        set fs_flags(value) {
          memory.setUint16(ptr + offsets.fs_flags, value, true);
        },
        get fs_rights_base() {
          return memory.getBigUint64(ptr + offsets.fs_rights_base, true);
        },
        set fs_rights_base(value) {
          memory.setBigUint64(ptr + offsets.fs_rights_base, value, true);
        },
        get fs_rights_inheriting() {
          return memory.getBigUint64(ptr + offsets.fs_rights_inheriting, true);
        },
        set fs_rights_inheriting(value) {
          memory.setBigUint64(ptr + offsets.fs_rights_inheriting, value, true);
        }
      };
    }
    Fdstat2.create = create;
  })(Fdstat || (Fdstat = {}));
  ((Fdstat2) => {
    Fdstat2.$ptr = Ptr.$param;
    Fdstat2.$transfer = Bytes.createTransfer(Fdstat2.size, 2 /* result */);
  })(Fdstat || (Fdstat = {}));
  var Fstflags;
  ((Fstflags2) => {
    Fstflags2.atim = 1 << 0;
    function atimOn(flags) {
      return (flags & Fstflags2.atim) !== 0;
    }
    Fstflags2.atimOn = atimOn;
    Fstflags2.atim_now = 1 << 1;
    function atim_nowOn(flags) {
      return (flags & Fstflags2.atim_now) !== 0;
    }
    Fstflags2.atim_nowOn = atim_nowOn;
    Fstflags2.mtim = 1 << 2;
    function mtimOn(flags) {
      return (flags & Fstflags2.mtim) !== 0;
    }
    Fstflags2.mtimOn = mtimOn;
    Fstflags2.mtim_now = 1 << 3;
    function mtim_nowOn(flags) {
      return (flags & Fstflags2.mtim_now) !== 0;
    }
    Fstflags2.mtim_nowOn = mtim_nowOn;
    function toString(value) {
      const parts = [];
      if (atimOn(value)) {
        parts.push("atim");
      }
      if (atim_nowOn(value)) {
        parts.push("atim_now");
      }
      if (mtimOn(value)) {
        parts.push("mtim");
      }
      if (mtim_nowOn(value)) {
        parts.push("mtim_now");
      }
      return parts.join(" | ");
    }
    Fstflags2.toString = toString;
  })(Fstflags || (Fstflags = {}));
  ((Fstflags2) => {
    Fstflags2.$param = U16.$param;
  })(Fstflags || (Fstflags = {}));
  var Prestat;
  ((Prestat2) => {
    Prestat2.size = 8;
    Prestat2.alignment = 4;
    const offsets = {
      tag: 0,
      len: 4
    };
    function create(memory, ptr) {
      memory.setUint8(ptr, Preopentype.dir);
      return {
        get $ptr() {
          return ptr;
        },
        get preopentype() {
          return memory.getUint8(ptr + offsets.tag);
        },
        set preopentype(value) {
          memory.setUint8(ptr + offsets.tag, value);
        },
        get len() {
          return memory.getUint32(ptr + offsets.len, true);
        },
        set len(value) {
          memory.setUint32(ptr + offsets.len, value, true);
        }
      };
    }
    Prestat2.create = create;
  })(Prestat || (Prestat = {}));
  ((Prestat2) => {
    Prestat2.$ptr = Ptr.$param;
    Prestat2.$transfer = Bytes.createTransfer(Prestat2.size, 2 /* result */);
  })(Prestat || (Prestat = {}));
  var Iovec;
  ((Iovec2) => {
    Iovec2.size = 8;
    const offsets = {
      buf: 0,
      buf_len: 4
    };
    function create(memory, ptr) {
      return {
        get $ptr() {
          return ptr;
        },
        get buf() {
          return memory.getUint32(ptr + offsets.buf, true);
        },
        set buf(value) {
          memory.setUint32(ptr + offsets.buf, value, true);
        },
        get buf_len() {
          return memory.getUint32(ptr + offsets.buf_len, true);
        },
        set buf_len(value) {
          memory.setUint32(ptr + offsets.buf_len, value, true);
        }
      };
    }
    Iovec2.create = create;
  })(Iovec || (Iovec = {}));
  ((Iovec2) => {
    Iovec2.$ptr = Ptr.$param;
    function createTransfer(memory, iovec3, iovs_len) {
      let dataSize = Iovec2.size * iovs_len;
      for (const item of new StructArray(memory, iovec3, iovs_len, Iovec2).values()) {
        dataSize += item.buf_len;
      }
      return {
        memorySize: dataSize,
        copy: (wasmMemory, from, transferMemory, to) => {
          if (from !== iovec3) {
            throw new Error(`IovecPtrParam needs to be used as an instance object`);
          }
          const forms = new StructArray(new DataView(wasmMemory), from, iovs_len, Iovec2);
          const tos = new StructArray(new DataView(transferMemory), to, iovs_len, Iovec2);
          let bufferIndex = to + Iovec2.size * iovs_len;
          const result = [];
          for (let i = 0; i < iovs_len; i++) {
            const fromIovec = forms.get(i);
            const toIovec = tos.get(i);
            toIovec.buf = bufferIndex;
            toIovec.buf_len = fromIovec.buf_len;
            bufferIndex += toIovec.buf_len;
            result.push({ from: toIovec.buf, to: fromIovec.buf, size: toIovec.buf_len });
          }
          return result;
        }
      };
    }
    Iovec2.createTransfer = createTransfer;
  })(Iovec || (Iovec = {}));
  var Ciovec;
  ((Ciovec2) => {
    Ciovec2.size = 8;
    const offsets = {
      buf: 0,
      buf_len: 4
    };
    function create(memory, ptr) {
      return {
        get $ptr() {
          return ptr;
        },
        get buf() {
          return memory.getUint32(ptr + offsets.buf, true);
        },
        set buf(value) {
          memory.setUint32(ptr + offsets.buf, value, true);
        },
        get buf_len() {
          return memory.getUint32(ptr + offsets.buf_len, true);
        },
        set buf_len(value) {
          memory.setUint32(ptr + offsets.buf_len, value, true);
        }
      };
    }
    Ciovec2.create = create;
  })(Ciovec || (Ciovec = {}));
  ((Ciovec2) => {
    Ciovec2.$ptr = Ptr.$param;
    function createTransfer(memory, ciovec3, ciovs_len) {
      let dataSize = Ciovec2.size * ciovs_len;
      for (const item of new StructArray(memory, ciovec3, ciovs_len, Ciovec2).values()) {
        dataSize += item.buf_len;
      }
      return {
        memorySize: dataSize,
        copy: (wasmMemory, from, transferMemory, to) => {
          if (from !== ciovec3) {
            throw new Error(`CiovecPtrParam needs to be used as an instance object`);
          }
          const forms = new StructArray(new DataView(wasmMemory), from, ciovs_len, Ciovec2);
          const tos = new StructArray(new DataView(transferMemory), to, ciovs_len, Ciovec2);
          const transferBuffer = new Uint8Array(transferMemory);
          let bufferIndex = to + Ciovec2.size * ciovs_len;
          for (let i = 0; i < ciovs_len; i++) {
            const fromIovec = forms.get(i);
            const toIovec = tos.get(i);
            toIovec.buf = bufferIndex;
            toIovec.buf_len = fromIovec.buf_len;
            transferBuffer.set(new Uint8Array(wasmMemory, fromIovec.buf, fromIovec.buf_len), toIovec.buf);
            bufferIndex += toIovec.buf_len;
          }
          return [];
        }
      };
    }
    Ciovec2.createTransfer = createTransfer;
  })(Ciovec || (Ciovec = {}));
  var Dirent;
  ((Dirent2) => {
    Dirent2.size = 24;
    const offsets = {
      d_next: 0,
      d_ino: 8,
      d_namlen: 16,
      d_type: 20
    };
    function create(memory, ptr) {
      return {
        get $ptr() {
          return ptr;
        },
        get d_next() {
          return memory.getBigUint64(ptr + offsets.d_next, true);
        },
        set d_next(value) {
          memory.setBigUint64(ptr + offsets.d_next, value, true);
        },
        get d_ino() {
          return memory.getBigUint64(ptr + offsets.d_ino, true);
        },
        set d_ino(value) {
          memory.setBigUint64(ptr + offsets.d_ino, value, true);
        },
        get d_namlen() {
          return memory.getUint32(ptr + offsets.d_namlen, true);
        },
        set d_namlen(value) {
          memory.setUint32(ptr + offsets.d_namlen, value, true);
        },
        get d_type() {
          return memory.getUint8(ptr + offsets.d_type);
        },
        set d_type(value) {
          memory.setUint8(ptr + offsets.d_type, value);
        }
      };
    }
    Dirent2.create = create;
  })(Dirent || (Dirent = {}));
  ((Dirent2) => {
    Dirent2.$ptr = Ptr.$param;
    function createTransfer(byteLength) {
      return Bytes.createTransfer(byteLength, 2 /* result */);
    }
    Dirent2.createTransfer = createTransfer;
  })(Dirent || (Dirent = {}));
  var Eventtype;
  ((Eventtype2) => {
    Eventtype2.clock = 0;
    Eventtype2.fd_read = 1;
    Eventtype2.fd_write = 2;
  })(Eventtype || (Eventtype = {}));
  var Eventrwflags;
  ((Eventrwflags2) => {
    Eventrwflags2.fd_readwrite_hangup = 1 << 0;
  })(Eventrwflags || (Eventrwflags = {}));
  var Event_fd_readwrite;
  ((Event_fd_readwrite2) => {
    Event_fd_readwrite2.size = 16;
    Event_fd_readwrite2.alignment = 8;
    const offsets = {
      nbytes: 0,
      flags: 8
    };
    function create(memory, ptr) {
      return {
        set nbytes(value) {
          memory.setBigUint64(ptr + offsets.nbytes, value, true);
        },
        set flags(value) {
          memory.setUint16(ptr + offsets.flags, value, true);
        }
      };
    }
    Event_fd_readwrite2.create = create;
  })(Event_fd_readwrite || (Event_fd_readwrite = {}));
  var Event;
  ((Event2) => {
    Event2.size = 32;
    Event2.alignment = 8;
    const offsets = {
      userdata: 0,
      error: 8,
      type: 10,
      fd_readwrite: 16
    };
    function create(memory, ptr) {
      return {
        set userdata(value) {
          memory.setBigUint64(ptr + offsets.userdata, value, true);
        },
        set error(value) {
          memory.setUint16(ptr + offsets.error, value, true);
        },
        set type(value) {
          memory.setUint8(ptr + offsets.type, value);
        },
        get fd_readwrite() {
          return Event_fd_readwrite.create(memory, ptr + offsets.fd_readwrite);
        }
      };
    }
    Event2.create = create;
  })(Event || (Event = {}));
  ((Event2) => {
    Event2.$ptr = Ptr.$param;
    function createTransfer(length) {
      return Bytes.createTransfer(Event2.size * length, 2 /* result */);
    }
    Event2.createTransfer = createTransfer;
  })(Event || (Event = {}));
  var Subclockflags;
  ((Subclockflags2) => {
    Subclockflags2.subscription_clock_abstime = 1 << 0;
  })(Subclockflags || (Subclockflags = {}));
  var Subscription_clock;
  ((Subscription_clock2) => {
    Subscription_clock2.size = 32;
    Subscription_clock2.alignment = 8;
    const offsets = {
      id: 0,
      timeout: 8,
      precision: 16,
      flags: 24
    };
    function create(memory, ptr) {
      return {
        get id() {
          return memory.getUint32(ptr + offsets.id, true);
        },
        get timeout() {
          return memory.getBigUint64(ptr + offsets.timeout, true);
        },
        get precision() {
          return memory.getBigUint64(ptr + offsets.precision, true);
        },
        get flags() {
          return memory.getUint16(ptr + offsets.flags, true);
        }
      };
    }
    Subscription_clock2.create = create;
  })(Subscription_clock || (Subscription_clock = {}));
  var Subscription_fd_readwrite;
  ((Subscription_fd_readwrite2) => {
    Subscription_fd_readwrite2.size = 4;
    Subscription_fd_readwrite2.alignment = 4;
    const offsets = {
      file_descriptor: 0
    };
    function create(memory, ptr) {
      return {
        get file_descriptor() {
          return memory.getUint32(ptr + offsets.file_descriptor, true);
        }
      };
    }
    Subscription_fd_readwrite2.create = create;
  })(Subscription_fd_readwrite || (Subscription_fd_readwrite = {}));
  var Subscription_u;
  ((Subscription_u2) => {
    Subscription_u2.size = 40;
    Subscription_u2.alignment = 8;
    Subscription_u2.tag_size = 1;
    const offsets = {
      type: 0,
      clock: 8,
      fd_read: 8,
      fd_write: 8
    };
    function create(memory, ptr) {
      return {
        get type() {
          return memory.getUint8(ptr + offsets.type);
        },
        get clock() {
          if (memory.getUint8(ptr + offsets.type) !== Eventtype.clock) {
            throw new WasiError(Errno.inval);
          }
          return Subscription_clock.create(memory, ptr + offsets.clock);
        },
        get fd_read() {
          if (memory.getUint8(ptr + offsets.type) !== Eventtype.fd_read) {
            throw new WasiError(Errno.inval);
          }
          return Subscription_fd_readwrite.create(memory, ptr + offsets.fd_read);
        },
        get fd_write() {
          if (memory.getUint8(ptr + offsets.type) !== Eventtype.fd_write) {
            throw new WasiError(Errno.inval);
          }
          return Subscription_fd_readwrite.create(memory, ptr + offsets.fd_write);
        }
      };
    }
    Subscription_u2.create = create;
  })(Subscription_u || (Subscription_u = {}));
  var Subscription;
  ((Subscription2) => {
    Subscription2.size = 48;
    Subscription2.alignment = 8;
    const offsets = {
      userdata: 0,
      u: 8
    };
    function create(memory, ptr) {
      return {
        get userdata() {
          return memory.getBigUint64(ptr + offsets.userdata, true);
        },
        get u() {
          return Subscription_u.create(memory, ptr + offsets.u);
        }
      };
    }
    Subscription2.create = create;
  })(Subscription || (Subscription = {}));
  ((Subscription2) => {
    Subscription2.$ptr = Ptr.$param;
    function createTransfer(length) {
      return Bytes.createTransfer(length * Subscription2.size, 1 /* param */);
    }
    Subscription2.createTransfer = createTransfer;
  })(Subscription || (Subscription = {}));
  var Riflags;
  ((Riflags2) => {
    Riflags2.recv_peek = 1 << 0;
    Riflags2.recv_waitall = 1 << 1;
  })(Riflags || (Riflags = {}));
  var Roflags;
  ((Roflags2) => {
    Roflags2.recv_data_truncated = 1 << 0;
  })(Roflags || (Roflags = {}));
  var Sdflags;
  ((Sdflags2) => {
    Sdflags2.rd = 1 << 0;
    Sdflags2.wr = 1 << 1;
    function toString(value) {
      const parts = [];
      if (value & Sdflags2.rd) {
        parts.push("rd");
      }
      if (value & Sdflags2.wr) {
        parts.push("wr");
      }
      return parts.join(" | ");
    }
    Sdflags2.toString = toString;
  })(Sdflags || (Sdflags = {}));
  ((Sdflags2) => {
    Sdflags2.$param = U8.$param;
  })(Sdflags || (Sdflags = {}));
  var WasiPath;
  ((WasiPath2) => {
    WasiPath2.$ptr = Ptr.$param;
    WasiPath2.$len = Size.$param;
    function createTransfer(path_len, direction) {
      return Bytes.createTransfer(path_len, direction);
    }
    WasiPath2.createTransfer = createTransfer;
  })(WasiPath || (WasiPath = {}));
  var args_sizes_get;
  ((args_sizes_get2) => {
    args_sizes_get2.name = "args_sizes_get";
    args_sizes_get2.signature = WasiFunctionSignature.create([U32.$ptr, U32.$ptr]);
    const _transfers = ArgumentsTransfer.create([U32.$transfer, U32.$transfer]);
    function transfers() {
      return _transfers;
    }
    args_sizes_get2.transfers = transfers;
    WasiFunctions.add(args_sizes_get2);
  })(args_sizes_get || (args_sizes_get = {}));
  var args_get;
  ((args_get2) => {
    args_get2.name = "args_get";
    args_get2.signature = WasiFunctionSignature.create([Ptr.$param, Ptr.$param]);
    function transfers(_memory, argvCount, argvBufSize) {
      return {
        size: argvCount * Ptr.size + argvBufSize,
        copy(wasmMemory, args, paramBuffer, paramIndex, transferMemory) {
          const transfer_argv_ptr = 0;
          const transfer_argvBuf_ptr = 0 + argvCount * Ptr.size;
          const paramView = new DataView(paramBuffer);
          paramView.setUint32(paramIndex, transfer_argv_ptr, true);
          paramView.setUint32(paramIndex + Ptr.size, transfer_argvBuf_ptr, true);
          return {
            copy() {
              const wasm_argv_ptr = args[0];
              const wasm_argvBuf_ptr = args[1];
              const diff = wasm_argvBuf_ptr - transfer_argvBuf_ptr;
              const wasm_argv_array = new PointerArray(new DataView(wasmMemory), wasm_argv_ptr, argvCount);
              const transfer_argv_array = new PointerArray(new DataView(transferMemory), transfer_argv_ptr, argvCount);
              for (let i = 0; i < argvCount; i++) {
                wasm_argv_array.set(i, transfer_argv_array.get(i) + diff);
              }
              new Uint8Array(wasmMemory).set(new Uint8Array(transferMemory, transfer_argvBuf_ptr, argvBufSize), wasm_argvBuf_ptr);
            }
          };
        }
      };
    }
    args_get2.transfers = transfers;
    WasiFunctions.add(args_get2);
  })(args_get || (args_get = {}));
  var clock_res_get;
  ((clock_res_get2) => {
    clock_res_get2.name = "clock_res_get";
    clock_res_get2.signature = WasiFunctionSignature.create([Clockid.$param, Timestamp.$ptr]);
    const _transfers = ArgumentsTransfer.create([Timestamp.$transfer]);
    function transfers() {
      return _transfers;
    }
    clock_res_get2.transfers = transfers;
    WasiFunctions.add(clock_res_get2);
  })(clock_res_get || (clock_res_get = {}));
  var clock_time_get;
  ((clock_time_get2) => {
    clock_time_get2.name = "clock_time_get";
    clock_time_get2.signature = WasiFunctionSignature.create([Clockid.$param, Timestamp.$param, Timestamp.$ptr]);
    const _transfers = ArgumentsTransfer.create([Timestamp.$transfer]);
    function transfers() {
      return _transfers;
    }
    clock_time_get2.transfers = transfers;
    WasiFunctions.add(clock_time_get2);
  })(clock_time_get || (clock_time_get = {}));
  var environ_sizes_get;
  ((environ_sizes_get2) => {
    environ_sizes_get2.name = "environ_sizes_get";
    environ_sizes_get2.signature = WasiFunctionSignature.create([U32.$ptr, U32.$ptr]);
    const _transfers = ArgumentsTransfer.create([U32.$transfer, U32.$transfer]);
    function transfers() {
      return _transfers;
    }
    environ_sizes_get2.transfers = transfers;
    WasiFunctions.add(environ_sizes_get2);
  })(environ_sizes_get || (environ_sizes_get = {}));
  var environ_get;
  ((environ_get2) => {
    environ_get2.name = "environ_get";
    environ_get2.signature = WasiFunctionSignature.create([Ptr.$param, Ptr.$param]);
    function transfers(_memory, argvCount, argvBufSize) {
      return {
        size: argvCount * Ptr.size + argvBufSize,
        copy(wasmMemory, args, paramBuffer, paramIndex, transferMemory) {
          const transfer_environ_ptr = 0;
          const transfer_environBuf_ptr = 0 + argvCount * Ptr.size;
          const paramView = new DataView(paramBuffer);
          paramView.setUint32(paramIndex, transfer_environ_ptr, true);
          paramView.setUint32(paramIndex + Ptr.size, transfer_environBuf_ptr, true);
          return {
            copy() {
              const wasm_environ_ptr = args[0];
              const wasm_environBuf_ptr = args[1];
              const diff = wasm_environBuf_ptr - transfer_environBuf_ptr;
              const wasm_environ_array = new PointerArray(new DataView(wasmMemory), wasm_environ_ptr, argvCount);
              const transfer_environ_array = new PointerArray(new DataView(transferMemory), transfer_environ_ptr, argvCount);
              for (let i = 0; i < argvCount; i++) {
                wasm_environ_array.set(i, transfer_environ_array.get(i) + diff);
              }
              new Uint8Array(wasmMemory).set(new Uint8Array(transferMemory, transfer_environBuf_ptr, argvBufSize), wasm_environBuf_ptr);
            }
          };
        }
      };
    }
    environ_get2.transfers = transfers;
    WasiFunctions.add(environ_get2);
  })(environ_get || (environ_get = {}));
  var fd_advise;
  ((fd_advise2) => {
    fd_advise2.name = "fd_advise";
    fd_advise2.signature = WasiFunctionSignature.create([Fd.$param, Filesize.$param, Filesize.$param, Advise.$param]);
    WasiFunctions.add(fd_advise2);
  })(fd_advise || (fd_advise = {}));
  var fd_allocate;
  ((fd_allocate2) => {
    fd_allocate2.name = "fd_allocate";
    fd_allocate2.signature = WasiFunctionSignature.create([Fd.$param, Filesize.$param, Filesize.$param]);
    WasiFunctions.add(fd_allocate2);
  })(fd_allocate || (fd_allocate = {}));
  var fd_close;
  ((fd_close2) => {
    fd_close2.name = "fd_close";
    fd_close2.signature = WasiFunctionSignature.create([Fd.$param]);
    WasiFunctions.add(fd_close2);
  })(fd_close || (fd_close = {}));
  var fd_datasync;
  ((fd_datasync2) => {
    fd_datasync2.name = "fd_datasync";
    fd_datasync2.signature = WasiFunctionSignature.create([Fd.$param]);
    WasiFunctions.add(fd_datasync2);
  })(fd_datasync || (fd_datasync = {}));
  var fd_fdstat_get;
  ((fd_fdstat_get2) => {
    fd_fdstat_get2.name = "fd_fdstat_get";
    fd_fdstat_get2.signature = WasiFunctionSignature.create([Fd.$param, Fdstat.$ptr]);
    const _transfers = ArgumentsTransfer.create([Fdstat.$transfer]);
    function transfers() {
      return _transfers;
    }
    fd_fdstat_get2.transfers = transfers;
    WasiFunctions.add(fd_fdstat_get2);
  })(fd_fdstat_get || (fd_fdstat_get = {}));
  var fd_fdstat_set_flags;
  ((fd_fdstat_set_flags2) => {
    fd_fdstat_set_flags2.name = "fd_fdstat_set_flags";
    fd_fdstat_set_flags2.signature = WasiFunctionSignature.create([Fd.$param, Fdflags.$param]);
    WasiFunctions.add(fd_fdstat_set_flags2);
  })(fd_fdstat_set_flags || (fd_fdstat_set_flags = {}));
  var fd_filestat_get;
  ((fd_filestat_get2) => {
    fd_filestat_get2.name = "fd_filestat_get";
    fd_filestat_get2.signature = WasiFunctionSignature.create([Fd.$param, Filestat.$ptr]);
    const _transfers = ArgumentsTransfer.create([Filestat.$transfer]);
    function transfers() {
      return _transfers;
    }
    fd_filestat_get2.transfers = transfers;
    WasiFunctions.add(fd_filestat_get2);
  })(fd_filestat_get || (fd_filestat_get = {}));
  var fd_filestat_set_size;
  ((fd_filestat_set_size2) => {
    fd_filestat_set_size2.name = "fd_filestat_set_size";
    fd_filestat_set_size2.signature = WasiFunctionSignature.create([Fd.$param, Filesize.$param]);
    WasiFunctions.add(fd_filestat_set_size2);
  })(fd_filestat_set_size || (fd_filestat_set_size = {}));
  var fd_filestat_set_times;
  ((fd_filestat_set_times2) => {
    fd_filestat_set_times2.name = "fd_filestat_set_times";
    fd_filestat_set_times2.signature = WasiFunctionSignature.create([Fd.$param, Timestamp.$param, Timestamp.$param, Fstflags.$param]);
    WasiFunctions.add(fd_filestat_set_times2);
  })(fd_filestat_set_times || (fd_filestat_set_times = {}));
  var fd_pread;
  ((fd_pread2) => {
    fd_pread2.name = "fd_pread";
    fd_pread2.signature = WasiFunctionSignature.create([Fd.$param, Iovec.$ptr, U32.$param, Filesize.$param, U32.$ptr]);
    function transfers(memory, iovs_ptr, iovs_len) {
      return ArgumentsTransfer.create([Iovec.createTransfer(memory, iovs_ptr, iovs_len), U32.$transfer]);
    }
    fd_pread2.transfers = transfers;
    WasiFunctions.add(fd_pread2);
  })(fd_pread || (fd_pread = {}));
  var fd_prestat_get;
  ((fd_prestat_get2) => {
    fd_prestat_get2.name = "fd_prestat_get";
    fd_prestat_get2.signature = WasiFunctionSignature.create([Fd.$param, Prestat.$ptr]);
    const _transfers = ArgumentsTransfer.create([Prestat.$transfer]);
    function transfers() {
      return _transfers;
    }
    fd_prestat_get2.transfers = transfers;
    WasiFunctions.add(fd_prestat_get2);
  })(fd_prestat_get || (fd_prestat_get = {}));
  var fd_prestat_dir_name;
  ((fd_prestat_dir_name2) => {
    fd_prestat_dir_name2.name = "fd_prestat_dir_name";
    fd_prestat_dir_name2.signature = WasiFunctionSignature.create([Fd.$param, WasiPath.$ptr, WasiPath.$len]);
    function transfers(_memory, _pathPtr, pathLen) {
      return ArgumentsTransfer.create([WasiPath.createTransfer(pathLen, 2 /* result */)]);
    }
    fd_prestat_dir_name2.transfers = transfers;
    WasiFunctions.add(fd_prestat_dir_name2);
  })(fd_prestat_dir_name || (fd_prestat_dir_name = {}));
  var fd_pwrite;
  ((fd_pwrite2) => {
    fd_pwrite2.name = "fd_pwrite";
    fd_pwrite2.signature = WasiFunctionSignature.create([Fd.$param, Ciovec.$ptr, U32.$param, Filesize.$param, U32.$ptr]);
    function transfers(memory, ciovs_ptr, ciovs_len) {
      return ArgumentsTransfer.create([Ciovec.createTransfer(memory, ciovs_ptr, ciovs_len), U32.$transfer]);
    }
    fd_pwrite2.transfers = transfers;
    WasiFunctions.add(fd_pwrite2);
  })(fd_pwrite || (fd_pwrite = {}));
  var fd_read;
  ((fd_read2) => {
    fd_read2.name = "fd_read";
    fd_read2.signature = WasiFunctionSignature.create([Fd.$param, Iovec.$ptr, U32.$param, U32.$ptr]);
    function transfers(memory, iovs_ptr, iovs_len) {
      return ArgumentsTransfer.create([Iovec.createTransfer(memory, iovs_ptr, iovs_len), U32.$transfer]);
    }
    fd_read2.transfers = transfers;
    WasiFunctions.add(fd_read2);
  })(fd_read || (fd_read = {}));
  var fd_readdir;
  ((fd_readdir2) => {
    fd_readdir2.name = "fd_readdir";
    fd_readdir2.signature = WasiFunctionSignature.create([Fd.$param, Dirent.$ptr, Size.$param, Dircookie.$param, U32.$ptr]);
    function transfers(_memory, _buf_ptr, buf_len) {
      return ArgumentsTransfer.create([Dirent.createTransfer(buf_len), U32.$transfer]);
    }
    fd_readdir2.transfers = transfers;
    WasiFunctions.add(fd_readdir2);
  })(fd_readdir || (fd_readdir = {}));
  var fd_renumber;
  ((fd_renumber2) => {
    fd_renumber2.name = "fd_renumber";
    fd_renumber2.signature = WasiFunctionSignature.create([Fd.$param, Fd.$param]);
    WasiFunctions.add(fd_renumber2);
  })(fd_renumber || (fd_renumber = {}));
  var fd_seek;
  ((fd_seek2) => {
    fd_seek2.name = "fd_seek";
    fd_seek2.signature = WasiFunctionSignature.create([Fd.$param, Filedelta.$param, Whence.$param, U64.$ptr]);
    const _transfers = ArgumentsTransfer.create([U64.$transfer]);
    function transfers() {
      return _transfers;
    }
    fd_seek2.transfers = transfers;
    WasiFunctions.add(fd_seek2);
  })(fd_seek || (fd_seek = {}));
  var fd_sync;
  ((fd_sync2) => {
    fd_sync2.name = "fd_sync";
    fd_sync2.signature = WasiFunctionSignature.create([Fd.$param]);
    WasiFunctions.add(fd_sync2);
  })(fd_sync || (fd_sync = {}));
  var fd_tell;
  ((fd_tell2) => {
    fd_tell2.name = "fd_tell";
    fd_tell2.signature = WasiFunctionSignature.create([Fd.$param, U64.$ptr]);
    const _transfers = ArgumentsTransfer.create([U64.$transfer]);
    function transfers() {
      return _transfers;
    }
    fd_tell2.transfers = transfers;
    WasiFunctions.add(fd_tell2);
  })(fd_tell || (fd_tell = {}));
  var fd_write;
  ((fd_write2) => {
    fd_write2.name = "fd_write";
    fd_write2.signature = WasiFunctionSignature.create([Fd.$param, Ciovec.$ptr, U32.$param, U32.$ptr]);
    function transfers(memory, ciovs_ptr, ciovs_len) {
      return ArgumentsTransfer.create([Ciovec.createTransfer(memory, ciovs_ptr, ciovs_len), U32.$transfer]);
    }
    fd_write2.transfers = transfers;
    WasiFunctions.add(fd_write2);
  })(fd_write || (fd_write = {}));
  var path_create_directory;
  ((path_create_directory2) => {
    path_create_directory2.name = "path_create_directory";
    path_create_directory2.signature = WasiFunctionSignature.create([Fd.$param, WasiPath.$ptr, WasiPath.$len]);
    function transfers(_memory, _path_ptr, path_len) {
      return ArgumentsTransfer.create([WasiPath.createTransfer(path_len, 1 /* param */)]);
    }
    path_create_directory2.transfers = transfers;
    WasiFunctions.add(path_create_directory2);
  })(path_create_directory || (path_create_directory = {}));
  var path_filestat_get;
  ((path_filestat_get2) => {
    path_filestat_get2.name = "path_filestat_get";
    path_filestat_get2.signature = WasiFunctionSignature.create([Fd.$param, Lookupflags.$param, WasiPath.$ptr, WasiPath.$len, Filestat.$ptr]);
    function transfers(_memory, _path_ptr, path_len) {
      return ArgumentsTransfer.create([WasiPath.createTransfer(path_len, 1 /* param */), Filestat.$transfer]);
    }
    path_filestat_get2.transfers = transfers;
    WasiFunctions.add(path_filestat_get2);
  })(path_filestat_get || (path_filestat_get = {}));
  var path_filestat_set_times;
  ((path_filestat_set_times2) => {
    path_filestat_set_times2.name = "path_filestat_set_times";
    path_filestat_set_times2.signature = WasiFunctionSignature.create([Fd.$param, Lookupflags.$param, WasiPath.$ptr, WasiPath.$len, Timestamp.$param, Timestamp.$param, Fstflags.$param]);
    function transfers(_memory, _path_ptr, path_len) {
      return ArgumentsTransfer.create([WasiPath.createTransfer(path_len, 1 /* param */)]);
    }
    path_filestat_set_times2.transfers = transfers;
    WasiFunctions.add(path_filestat_set_times2);
  })(path_filestat_set_times || (path_filestat_set_times = {}));
  var path_link;
  ((path_link2) => {
    path_link2.name = "path_link";
    path_link2.signature = WasiFunctionSignature.create([Fd.$param, Lookupflags.$param, WasiPath.$ptr, WasiPath.$len, Fd.$param, WasiPath.$ptr, WasiPath.$len]);
    function transfers(_memory, _old_path_ptr, old_path_len, _new_path_ptr, new_path_len) {
      return ArgumentsTransfer.create([WasiPath.createTransfer(old_path_len, 1 /* param */), WasiPath.createTransfer(new_path_len, 1 /* param */)]);
    }
    path_link2.transfers = transfers;
    WasiFunctions.add(path_link2);
  })(path_link || (path_link = {}));
  var path_open;
  ((path_open2) => {
    path_open2.name = "path_open";
    path_open2.signature = WasiFunctionSignature.create([Fd.$param, Lookupflags.$param, WasiPath.$ptr, WasiPath.$len, Oflags.$param, Rights.$param, Rights.$param, Fdflags.$param, Fd.$ptr]);
    function transfers(_memory, _path, pathLen) {
      return ArgumentsTransfer.create([WasiPath.createTransfer(pathLen, 1 /* param */), Fd.$transfer]);
    }
    path_open2.transfers = transfers;
    WasiFunctions.add(path_open2);
  })(path_open || (path_open = {}));
  var path_readlink;
  ((path_readlink2) => {
    path_readlink2.name = "path_readlink";
    path_readlink2.signature = WasiFunctionSignature.create([Fd.$param, WasiPath.$ptr, WasiPath.$len, Bytes.$ptr, Size.$param, U32.$ptr]);
    function transfers(_memory, _path_ptr, path_len, _buf, buf_len) {
      return ArgumentsTransfer.create([WasiPath.createTransfer(path_len, 1 /* param */), Bytes.createTransfer(buf_len, 2 /* result */), U32.$transfer]);
    }
    path_readlink2.transfers = transfers;
    WasiFunctions.add(path_readlink2);
  })(path_readlink || (path_readlink = {}));
  var path_remove_directory;
  ((path_remove_directory2) => {
    path_remove_directory2.name = "path_remove_directory";
    path_remove_directory2.signature = WasiFunctionSignature.create([Fd.$param, WasiPath.$ptr, WasiPath.$len]);
    function transfers(_memory, _path_ptr, path_len) {
      return ArgumentsTransfer.create([WasiPath.createTransfer(path_len, 1 /* param */)]);
    }
    path_remove_directory2.transfers = transfers;
    WasiFunctions.add(path_remove_directory2);
  })(path_remove_directory || (path_remove_directory = {}));
  var path_rename;
  ((path_rename2) => {
    path_rename2.name = "path_rename";
    path_rename2.signature = WasiFunctionSignature.create([Fd.$param, WasiPath.$ptr, WasiPath.$len, Fd.$param, WasiPath.$ptr, WasiPath.$len]);
    function transfers(_memory, _old_path_ptr, old_path_len, _new_path_ptr, new_path_len) {
      return ArgumentsTransfer.create([WasiPath.createTransfer(old_path_len, 1 /* param */), WasiPath.createTransfer(new_path_len, 1 /* param */)]);
    }
    path_rename2.transfers = transfers;
    WasiFunctions.add(path_rename2);
  })(path_rename || (path_rename = {}));
  var path_symlink;
  ((path_symlink2) => {
    path_symlink2.name = "path_symlink";
    path_symlink2.signature = WasiFunctionSignature.create([WasiPath.$ptr, WasiPath.$len, Fd.$param, WasiPath.$ptr, WasiPath.$len]);
    function transfers(_memory, _old_path_ptr, old_path_len, _new_path_ptr, new_path_len) {
      return ArgumentsTransfer.create([WasiPath.createTransfer(old_path_len, 1 /* param */), WasiPath.createTransfer(new_path_len, 1 /* param */)]);
    }
    path_symlink2.transfers = transfers;
    WasiFunctions.add(path_symlink2);
  })(path_symlink || (path_symlink = {}));
  var path_unlink_file;
  ((path_unlink_file2) => {
    path_unlink_file2.name = "path_unlink_file";
    path_unlink_file2.signature = WasiFunctionSignature.create([Fd.$param, WasiPath.$ptr, WasiPath.$len]);
    function transfers(_memory, _path_ptr, path_len) {
      return ArgumentsTransfer.create([WasiPath.createTransfer(path_len, 1 /* param */)]);
    }
    path_unlink_file2.transfers = transfers;
    WasiFunctions.add(path_unlink_file2);
  })(path_unlink_file || (path_unlink_file = {}));
  var poll_oneoff;
  ((poll_oneoff2) => {
    poll_oneoff2.name = "poll_oneoff";
    poll_oneoff2.signature = WasiFunctionSignature.create([Subscription.$ptr, Event.$ptr, Size.$param, U32.$ptr]);
    function transfers(_memory, _input, _output, subscriptions) {
      return ArgumentsTransfer.create([Subscription.createTransfer(subscriptions), Event.createTransfer(subscriptions), U32.$transfer]);
    }
    poll_oneoff2.transfers = transfers;
    WasiFunctions.add(poll_oneoff2);
  })(poll_oneoff || (poll_oneoff = {}));
  var proc_exit;
  ((proc_exit2) => {
    proc_exit2.name = "proc_exit";
    proc_exit2.signature = WasiFunctionSignature.create([Exitcode.$param]);
    WasiFunctions.add(proc_exit2);
  })(proc_exit || (proc_exit = {}));
  var sched_yield;
  ((sched_yield2) => {
    sched_yield2.name = "sched_yield";
    sched_yield2.signature = WasiFunctionSignature.create([]);
    WasiFunctions.add(sched_yield2);
  })(sched_yield || (sched_yield = {}));
  var random_get;
  ((random_get2) => {
    random_get2.name = "random_get";
    random_get2.signature = WasiFunctionSignature.create([Byte.$ptr, Size.$param]);
    function transfers(_memory, _buf, buf_len) {
      return ArgumentsTransfer.create([Bytes.createTransfer(buf_len, 2 /* result */)]);
    }
    random_get2.transfers = transfers;
    WasiFunctions.add(random_get2);
  })(random_get || (random_get = {}));
  var sock_accept;
  ((sock_accept2) => {
    sock_accept2.name = "sock_accept";
    sock_accept2.signature = WasiFunctionSignature.create([Fd.$param, Fdflags.$param, Fd.$ptr]);
    const _transfers = ArgumentsTransfer.create([Fd.$transfer]);
    function transfers() {
      return _transfers;
    }
    sock_accept2.transfers = transfers;
    WasiFunctions.add(sock_accept2);
  })(sock_accept || (sock_accept = {}));
  var sock_shutdown;
  ((sock_shutdown2) => {
    sock_shutdown2.name = "sock_shutdown";
    sock_shutdown2.signature = WasiFunctionSignature.create([Fd.$param, Sdflags.$param]);
    WasiFunctions.add(sock_shutdown2);
  })(sock_shutdown || (sock_shutdown = {}));
  var thread_spawn;
  ((thread_spawn2) => {
    thread_spawn2.name = "thread-spawn";
    thread_spawn2.signature = WasiFunctionSignature.create([U32.$ptr]);
    const _transfers = ArgumentsTransfer.create([U32.$transfer]);
    function transfers() {
      return _transfers;
    }
    thread_spawn2.transfers = transfers;
    WasiFunctions.add(thread_spawn2);
  })(thread_spawn || (thread_spawn = {}));
  var thread_exit;
  ((thread_exit2) => {
    thread_exit2.name = "thread_exit";
    thread_exit2.signature = WasiFunctionSignature.create([U32.$param]);
    WasiFunctions.add(thread_exit2);
  })(thread_exit || (thread_exit = {}));

  // src/common/connection.ts
  var Offsets;
  ((Offsets2) => {
    Offsets2.lock_size = 4;
    Offsets2.lock_index = 0;
    Offsets2.method_size = 4;
    Offsets2.method_index = Offsets2.lock_index + Offsets2.lock_size;
    Offsets2.errno_size = 2;
    Offsets2.errno_index = Offsets2.method_index + Offsets2.method_size;
    Offsets2.params_index = Offsets2.errno_index + Offsets2.errno_size + 2;
    Offsets2.header_size = Offsets2.params_index;
  })(Offsets || (Offsets = {}));
  var StartMainMessage;
  ((StartMainMessage2) => {
    function is(message) {
      const candidate = message;
      return candidate && candidate.method === "startMain";
    }
    StartMainMessage2.is = is;
  })(StartMainMessage || (StartMainMessage = {}));
  var StartThreadMessage;
  ((StartThreadMessage2) => {
    function is(message) {
      const candidate = message;
      return candidate && candidate.method === "startThread";
    }
    StartThreadMessage2.is = is;
  })(StartThreadMessage || (StartThreadMessage = {}));
  var WorkerReadyMessage;
  ((WorkerReadyMessage3) => {
    function is(message) {
      const candidate = message;
      return candidate && candidate.method === "workerReady";
    }
    WorkerReadyMessage3.is = is;
  })(WorkerReadyMessage || (WorkerReadyMessage = {}));
  var WorkerDoneMessage;
  ((WorkerDoneMessage2) => {
    function is(message) {
      const candidate = message;
      return candidate && candidate.method === "workerDone";
    }
    WorkerDoneMessage2.is = is;
  })(WorkerDoneMessage || (WorkerDoneMessage = {}));
  var TraceMessage;
  ((TraceMessage3) => {
    function is(message) {
      const candidate = message;
      return candidate && candidate.method === "trace";
    }
    TraceMessage3.is = is;
  })(TraceMessage || (TraceMessage = {}));
  var TraceSummaryMessage;
  ((TraceSummaryMessage2) => {
    function is(message) {
      const candidate = message;
      return candidate && candidate.method === "traceSummary";
    }
    TraceSummaryMessage2.is = is;
  })(TraceSummaryMessage || (TraceSummaryMessage = {}));
  var WasiCallMessage;
  ((WasiCallMessage2) => {
    function is(message) {
      return Array.isArray(message) && message.length === 2 && message[0] instanceof SharedArrayBuffer && message[1] instanceof SharedArrayBuffer;
    }
    WasiCallMessage2.is = is;
  })(WasiCallMessage || (WasiCallMessage = {}));

  // src/common/trace.ts
  var Memory = class {
    constructor(raw) {
      __publicField(this, "raw");
      __publicField(this, "dataView");
      __publicField(this, "decoder");
      this.raw = raw;
      this.dataView = new DataView(this.raw);
      this.decoder = ral_default().TextDecoder.create();
    }
    readUint32(ptr) {
      return this.dataView.getUint32(ptr, true);
    }
    readUint32Array(ptr, size) {
      const view = this.dataView;
      return {
        get $ptr() {
          return ptr;
        },
        get size() {
          return size;
        },
        get(index) {
          return view.getUint32(ptr + index * Uint32Array.BYTES_PER_ELEMENT, true);
        },
        set(index, value) {
          view.setUint32(ptr + index * Uint32Array.BYTES_PER_ELEMENT, value, true);
        }
      };
    }
    readUint64(ptr) {
      return this.dataView.getBigUint64(ptr, true);
    }
    readStruct(ptr, info) {
      return info.create(this.dataView, ptr);
    }
    readString(ptr, len = -1) {
      const length = len === -1 ? this.getStringLength(ptr) : len;
      if (length === -1) {
        throw new Error(`No null terminate character found`);
      }
      return this.decoder.decode(new Uint8Array(this.raw, ptr, length).slice(0));
    }
    readBytes(ptr, length) {
      return new Uint8Array(this.raw, ptr, length);
    }
    getStringLength(start) {
      const bytes = new Uint8Array(this.raw);
      let index = start;
      while (index < bytes.byteLength) {
        if (bytes[index] === 0) {
          return index - start;
        }
        index++;
      }
      return -1;
    }
  };
  var TraceMessage2;
  ((TraceMessage3) => {
    function create() {
      let argvCount = 0;
      let argvBufSize = 0;
      let environCount = 0;
      let environBufSize = 0;
      const preStats = /* @__PURE__ */ new Map();
      const fileDescriptors = /* @__PURE__ */ new Map();
      function getFileDescriptorPath(fd3) {
        switch (fd3) {
          case 0:
            return "stdin";
          case 1:
            return "stdout";
          case 2:
            return "stderr";
          default:
            return fileDescriptors.get(fd3) || `fd: ${fd3}`;
        }
      }
      return {
        args_sizes_get: (_memory, result, argvCount_ptr, argvBufSize_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            argvCount = memory.readUint32(argvCount_ptr);
            argvBufSize = memory.readUint32(argvBufSize_ptr);
            return `args_sizes_get() => [count: ${argvCount}, bufSize: ${argvBufSize}, result: ${Errno.toString(result)}]`;
          } else {
            return `args_sizes_get() => [result: ${Errno.toString(result)}]`;
          }
        },
        args_get: (_memory, result, argv_ptr, _argvBuf_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            const argv = memory.readUint32Array(argv_ptr, argvCount);
            const buffer = [`args_get() => [result: ${Errno.toString(result)}]`];
            for (let i = 0; i < argvCount; i++) {
              const valueStartOffset = argv.get(i);
              const arg = memory.readString(valueStartOffset);
              buffer.push(`	${i}: ${arg}`);
            }
            return buffer.join("\n");
          } else {
            return `args_get() => [result: ${Errno.toString(result)}]`;
          }
        },
        environ_sizes_get: (_memory, result, environCount_ptr, environBufSize_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            environCount = memory.readUint32(environCount_ptr);
            environBufSize = memory.readUint32(environBufSize_ptr);
            return `environ_sizes_get() => [envCount: ${environCount}, envBufSize: ${environBufSize}, result: ${Errno.toString(result)}]`;
          } else {
            return `environ_sizes_get() => [result: ${Errno.toString(result)}]`;
          }
        },
        environ_get: (_memory, result, environ_ptr, _environBuf_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            const environ = memory.readUint32Array(environ_ptr, environCount);
            const buffer = [`environ_get() => [result: ${Errno.toString(result)}]`];
            for (let i = 0; i < environCount; i++) {
              const valueStartOffset = environ.get(i);
              const env = memory.readString(valueStartOffset);
              buffer.push(`	${i}: ${env}`);
            }
            return buffer.join("\n");
          } else {
            return `environ_get() => [result: ${Errno.toString(result)}]`;
          }
        },
        fd_prestat_get: (_memory, result, fd3, bufPtr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            const prestat3 = memory.readStruct(bufPtr, Prestat);
            return `fd_prestat_get(fd: ${fd3}) => [prestat: ${JSON.stringify(prestat3, void 0, 0)}, result: ${Errno.toString(result)}]`;
          } else {
            return `fd_prestat_get(fd: ${fd3}) => [result: ${Errno.toString(result)}]`;
          }
        },
        fd_prestat_dir_name: (_memory, result, fd3, pathPtr, pathLen) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            const path = memory.readString(pathPtr, pathLen);
            preStats.set(fd3, path);
            fileDescriptors.set(fd3, path);
            return `fd_prestat_dir_name(fd: ${fd3}) => [path: ${path}, result: ${Errno.toString(result)}]`;
          } else {
            return `fd_prestat_dir_name(fd: ${fd3}) => [result: ${Errno.toString(result)}]`;
          }
        },
        clock_res_get: (_memory, result, id, timestamp_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            return `clock_res_get(id: ${Clockid.toString(id)}) => [timestamp: ${memory.readUint64(timestamp_ptr)}, result: ${Errno.toString(result)}]`;
          } else {
            return `clock_res_get(id: ${Clockid.toString(id)}) => [result: ${Errno.toString(result)}]`;
          }
        },
        clock_time_get: (_memory, result, id, precision, timestamp_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            return `clock_time_get(id: ${Clockid.toString(id)}, precision: ${precision}) => [timestamp: ${memory.readUint64(timestamp_ptr)}, result: ${Errno.toString(result)}]`;
          } else {
            return `clock_time_get(id: ${Clockid.toString(id)}, precision: ${precision}) => [result: ${Errno.toString(result)}]`;
          }
        },
        fd_advise: (_memory, result, fd3, offset, length, advise3) => {
          return `fd_advise(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, offset: ${offset}, length: ${length}, advise: ${Advise.toString(advise3)}) => [result: ${Errno.toString(result)}]`;
        },
        fd_allocate: (_memory, result, fd3, offset, len) => {
          return `fd_allocate(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, offset: ${offset}, len: ${len}) => [result: ${Errno.toString(result)}]`;
        },
        fd_close: (_memory, result, fd3) => {
          const message = `fd_close(fd: ${fd3} => ${getFileDescriptorPath(fd3)}) => [result: ${Errno.toString(result)}]`;
          fileDescriptors.delete(fd3);
          return message;
        },
        fd_datasync: (_memory, result, fd3) => {
          return `fd_datasync(fd: ${fd3} => ${getFileDescriptorPath(fd3)}) => [result: ${Errno.toString(result)}]`;
        },
        fd_fdstat_get: (_memory, result, fd3, fdstat_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            const fdstat3 = memory.readStruct(fdstat_ptr, Fdstat);
            return `fd_fdstat_get(fd: ${fd3} => ${getFileDescriptorPath(fd3)}) => [fdstat: ${Filetype.toString(fdstat3.fs_filetype)}}, result: ${Errno.toString(result)}]`;
          } else {
            return `fd_fdstat_get(fd: ${fd3} => ${getFileDescriptorPath(fd3)}) => [result: ${Errno.toString(result)}]`;
          }
        },
        fd_fdstat_set_flags: (_memory, result, fd3, fdflags3) => {
          return `fd_fdstat_set_flags(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, fdflags: ${Fdflags.toString(fdflags3)}) => [result: ${Errno.toString(result)}]`;
        },
        fd_filestat_get: (_memory, result, fd3, filestat_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            const filestat3 = memory.readStruct(filestat_ptr, Filestat);
            return `fd_filestat_get(fd: ${fd3} => ${getFileDescriptorPath(fd3)}) => [filestat: ${Filetype.toString(filestat3.filetype)}, result: ${Errno.toString(result)}]`;
          } else {
            return `fd_filestat_get(fd: ${fd3} => ${getFileDescriptorPath(fd3)}) => [result: ${Errno.toString(result)}]`;
          }
        },
        fd_filestat_set_size: (_memory, result, fd3, size) => {
          return `fd_filestat_set_size(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, size: ${size}) => [result: ${Errno.toString(result)}]`;
        },
        fd_filestat_set_times: (_memory, result, fd3, atim, mtim, fst_flags) => {
          return `fd_filestat_set_times(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, atim: ${atim}, mtim: ${mtim}, fst_flags: ${Fstflags.toString(fst_flags)}) => [result: ${Errno.toString(result)}]`;
        },
        fd_pread: (_memory, result, fd3, _iovs_ptr, _iovs_len, offset, bytesRead_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            return `fd_pread(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, offset: ${offset}) => [bytesRead: ${memory.readUint32(bytesRead_ptr)}, result: ${Errno.toString(result)}]`;
          } else {
            return `fd_pread(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, offset: ${offset}) => [result: ${Errno.toString(result)}]`;
          }
        },
        fd_pwrite: (_memory, result, fd3, _ciovs_ptr, _ciovs_len, offset, bytesWritten_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            return `fd_pwrite(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, offset: ${offset}) => [bytesWritten: ${memory.readUint32(bytesWritten_ptr)}, result: ${Errno.toString(result)}]`;
          } else {
            return `fd_pwrite(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, offset: ${offset}) => [result: ${Errno.toString(result)}]`;
          }
        },
        fd_read: (_memory, result, fd3, _iovs_ptr, _iovs_len, bytesRead_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            return `fd_read(fd: ${fd3} => ${getFileDescriptorPath(fd3)}) => [bytesRead: ${memory.readUint32(bytesRead_ptr)}, result: ${Errno.toString(result)}]`;
          } else {
            return `fd_read(fd: ${fd3} => ${getFileDescriptorPath(fd3)}) => [result: ${Errno.toString(result)}]`;
          }
        },
        fd_readdir: (_memory, result, fd3, _buf_ptr, _buf_len, cookie, buf_used_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            return `fd_readdir(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, cookie: ${cookie}) => [buf_used: ${memory.readUint32(buf_used_ptr)}, result: ${Errno.toString(result)}]`;
          } else {
            return `fd_readdir(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, cookie: ${cookie}) => [result: ${Errno.toString(result)}]`;
          }
        },
        fd_seek: (_memory, result, fd3, offset, whence3, new_offset_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            return `fd_seek(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, offset: ${offset}, whence: ${Whence.toString(whence3)}) => [new_offset: ${memory.readUint64(new_offset_ptr)}, result: ${Errno.toString(result)}]`;
          } else {
            return `fd_seek(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, offset: ${offset}, whence: ${Whence.toString(whence3)}) => [result: ${Errno.toString(result)}]`;
          }
        },
        fd_renumber: (_memory, result, fd3, to) => {
          const message = `fd_renumber(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, to: ${to}) => [result: ${Errno.toString(result)}]`;
          if (result === Errno.success) {
            fileDescriptors.set(to, fileDescriptors.get(fd3));
            fileDescriptors.delete(fd3);
          }
          return message;
        },
        fd_sync: (_memory, result, fd3) => {
          return `fd_sync(fd: ${fd3} => ${getFileDescriptorPath(fd3)}) => [result: ${Errno.toString(result)}]`;
        },
        fd_tell: (_memory, result, fd3, offset_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            return `fd_tell(fd: ${fd3} => ${getFileDescriptorPath(fd3)}) => [offset: ${memory.readUint64(offset_ptr)}, result: ${Errno.toString(result)}]`;
          } else {
            return `fd_tell(fd: ${fd3} => ${getFileDescriptorPath(fd3)}) => [result: ${Errno.toString(result)}]`;
          }
        },
        fd_write: (_memory, result, fd3, _ciovs_ptr, _ciovs_len, bytesWritten_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            return `fd_write(fd: ${fd3} => ${getFileDescriptorPath(fd3)}) => [bytesWritten: ${memory.readUint32(bytesWritten_ptr)}, result: ${Errno.toString(result)}]`;
          } else {
            return `fd_write(fd: ${fd3} => ${fd3 === 1 || fd3 === 2 ? fd3 : fileDescriptors.get(fd3)}) => [result: ${Errno.toString(result)}]`;
          }
        },
        path_create_directory: (_memory, result, fd3, path_ptr, path_len) => {
          const memory = new Memory(_memory);
          return `path_create_directory(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, path: ${memory.readString(path_ptr, path_len)}) => [result: ${Errno.toString(result)}]`;
        },
        path_filestat_get: (_memory, result, fd3, flags, path_ptr, path_len, filestat_ptr) => {
          const memory = new Memory(_memory);
          if (result === Errno.success) {
            const filestat3 = memory.readStruct(filestat_ptr, Filestat);
            return `path_filestat_get(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, flags: ${Lookupflags.toString(flags)} path: ${memory.readString(path_ptr, path_len)}) => [filestat: ${Filetype.toString(filestat3.filetype)} result: ${Errno.toString(result)}]`;
          } else {
            return `path_filestat_get(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, flags: ${Lookupflags.toString(flags)} path: ${memory.readString(path_ptr, path_len)}) => [result: ${Errno.toString(result)}]`;
          }
        },
        path_filestat_set_times: (_memory, result, fd3, flags, path_ptr, path_len, atim, mtim, fst_flags) => {
          const memory = new Memory(_memory);
          return `path_filestat_set_times(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, flags: ${Lookupflags.toString(flags)} path: ${memory.readString(path_ptr, path_len)}, atim: ${atim}, mtim: ${mtim}, fst_flags: ${Fstflags.toString(fst_flags)}) => [result: ${Errno.toString(result)}]`;
        },
        path_link: (_memory, result, old_fd, old_flags, old_path_ptr, old_path_len, new_fd, new_path_ptr, new_path_len) => {
          const memory = new Memory(_memory);
          return `path_link(old_fd: ${old_fd} => ${fileDescriptors.get(old_fd)}, old_flags: ${Lookupflags.toString(old_flags)}, old_path: ${memory.readString(old_path_ptr, old_path_len)}, new_fd: ${new_fd} => ${fileDescriptors.get(new_fd)}, new_path: ${memory.readString(new_path_ptr, new_path_len)}) => [result: ${Errno.toString(result)}]`;
        },
        path_open: (_memory, result, fd3, dirflags, path_ptr, path_len, oflags3, _fs_rights_base, _fs_rights_inheriting, fdflags3, fd_ptr) => {
          const memory = new Memory(_memory);
          const path = memory.readString(path_ptr, path_len);
          if (result === Errno.success) {
            const resultFd = memory.readUint32(fd_ptr);
            const message = `path_open(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, dirflags: ${Lookupflags.toString(dirflags)}, path: ${path}, oflags: ${Oflags.toString(oflags3)}, fdflags: ${Fdflags.toString(fdflags3)}) => [fd: ${resultFd}, result: ${Errno.toString(result)}]`;
            if (result === Errno.success) {
              const parentPath = fileDescriptors.get(fd3);
              fileDescriptors.set(resultFd, parentPath !== void 0 ? ral_default().path.join(parentPath, path) : path);
            }
            return message;
          } else {
            return `path_open(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, dirflags: ${Lookupflags.toString(dirflags)}, path: ${path}, oflags: ${Oflags.toString(oflags3)}, fdflags: ${Fdflags.toString(fdflags3)}) => [result: ${Errno.toString(result)}]`;
          }
        },
        path_readlink: (_memory, result, fd3, path_ptr, path_len, buf_ptr, buf_len, result_size_ptr) => {
          const memory = new Memory(_memory);
          if (result === Errno.success) {
            const resultSize = memory.readUint32(result_size_ptr);
            return `path_readlink(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, path: ${memory.readString(path_ptr, path_len)}, buf_len: ${buf_len}) => [target: ${memory.readString(buf_ptr, resultSize)}, result: ${Errno.toString(result)}]`;
          } else {
            return `path_readlink(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, path: ${memory.readString(path_ptr, path_len)}, buf_len: ${buf_len}) => [result: ${Errno.toString(result)}]`;
          }
        },
        path_remove_directory: (_memory, result, fd3, path_ptr, path_len) => {
          const memory = new Memory(_memory);
          return `path_remove_directory(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, path: ${memory.readString(path_ptr, path_len)}) => [result: ${Errno.toString(result)}]`;
        },
        path_rename: (_memory, result, old_fd, old_path_ptr, old_path_len, new_fd, new_path_ptr, new_path_len) => {
          const memory = new Memory(_memory);
          return `path_rename(old_fd: ${old_fd} => ${fileDescriptors.get(old_fd)}, old_path: ${memory.readString(old_path_ptr, old_path_len)}, new_fd: ${new_fd} => ${fileDescriptors.get(new_fd)}, new_path: ${memory.readString(new_path_ptr, new_path_len)}) => [result: ${Errno.toString(result)}]`;
        },
        path_symlink: (_memory, result, old_path_ptr, old_path_len, fd3, new_path_ptr, new_path_len) => {
          const memory = new Memory(_memory);
          return `path_symlink(old_path: ${memory.readString(old_path_ptr, old_path_len)}, fd: ${fd3} => ${getFileDescriptorPath(fd3)}, new_path: ${memory.readString(new_path_ptr, new_path_len)}) => [result: ${Errno.toString(result)}]`;
        },
        path_unlink_file: (_memory, result, fd3, path_ptr, path_len) => {
          const memory = new Memory(_memory);
          return `path_unlink_file(fd: ${fd3} => ${getFileDescriptorPath(fd3)}, path: ${memory.readString(path_ptr, path_len)}) => [result: ${Errno.toString(result)}]`;
        },
        poll_oneoff: (_memory, result, _input, _output, _subscriptions, _result_size_ptr) => {
          return `poll_oneoff(...) => [result: ${Errno.toString(result)}]`;
        },
        proc_exit: (_memory, result, rval) => {
          return `proc_exit(rval: ${rval}) => [result: ${Errno.toString(result)}]`;
        },
        sched_yield: (_memory, result) => {
          return `sched_yield() => [result: ${Errno.toString(result)}]`;
        },
        random_get: (_memory, result, _buf, _buf_len) => {
          return `random_get(...) => [result: ${Errno.toString(result)}]`;
        },
        sock_accept: (_memory, result, fd3, flags, result_fd_ptr) => {
          if (result === Errno.success) {
            const memory = new Memory(_memory);
            return `sock_accept(fd: ${fd3}}, flags: ${flags}) => [result_fd: ${memory.readUint32(result_fd_ptr)}, result: ${Errno.toString(result)}]`;
          } else {
            return `sock_accept(fd: ${fd3}}, flags: ${flags}) => [result: ${Errno.toString(result)}]`;
          }
        },
        sock_shutdown: (_memory, result, fd3, sdflags3) => {
          return `sock_shutdown(fd: ${fd3}, sdflags: ${Sdflags.toString(sdflags3)}) => [result: ${Errno.toString(result)}]`;
        },
        thread_exit: (_memory, result, tid) => {
          return `thread_exit(tid: ${tid}) => [result: ${Errno.toString(result)}]`;
        },
        "thread-spawn": (_memory, result, _start_args_ptr) => {
          return `thread-spawn(...) => [result: ${Errno.toString(result)}]`;
        }
      };
    }
    TraceMessage3.create = create;
  })(TraceMessage2 || (TraceMessage2 = {}));

  // src/common/host.ts
  var HostConnection = class {
    constructor(timeout) {
      __publicField(this, "timeout");
      this.timeout = timeout;
    }
    call(func, args, wasmMemory, transfers) {
      const signature = func.signature;
      if (signature.params.length !== args.length) {
        throw new WasiError(Errno.inval);
      }
      const [paramBuffer, resultBuffer, reverseTransfer] = this.createCallArrays(func.name, signature, args, wasmMemory, transfers);
      const result = this.doCall(paramBuffer, resultBuffer);
      if (result !== Errno.success || resultBuffer === wasmMemory || reverseTransfer === void 0) {
        return result;
      }
      const targetMemory = new Uint8Array(wasmMemory);
      if (ReverseTransfer.isCustom(reverseTransfer)) {
        reverseTransfer.copy();
      } else if (ReverseTransfer.isArguments(reverseTransfer)) {
        let reverseIndex = 0;
        for (let i = 0; i < args.length; i++) {
          const param = signature.params[i];
          if (param.kind !== 1 /* ptr */) {
            continue;
          }
          const reverse = reverseTransfer[reverseIndex++];
          if (reverse !== void 0) {
            if (Array.isArray(reverse)) {
              for (const single of reverse) {
                targetMemory.set(new Uint8Array(resultBuffer, single.from, single.size), single.to);
              }
            } else {
              targetMemory.set(new Uint8Array(resultBuffer, reverse.from, reverse.size), reverse.to);
            }
          }
        }
      }
      return result;
    }
    doCall(paramBuffer, resultBuffer) {
      const sync = new Int32Array(paramBuffer, Offsets.lock_index, 1);
      Atomics.store(sync, 0, 0);
      this.postMessage([paramBuffer, resultBuffer]);
      const result = Atomics.wait(sync, 0, 0, this.timeout);
      switch (result) {
        case "timed-out":
          return Errno.timedout;
        case "not-equal":
          const value = Atomics.load(sync, 0);
          if (value !== 1) {
            return Errno.nosys;
          }
      }
      return new Uint16Array(paramBuffer, Offsets.errno_index, 1)[0];
    }
    createCallArrays(name, signature, args, wasmMemory, transfer) {
      const paramBuffer = new SharedArrayBuffer(Offsets.header_size + signature.memorySize);
      const paramView = new DataView(paramBuffer);
      paramView.setUint32(Offsets.method_index, WasiFunctions.getIndex(name), true);
      if (wasmMemory instanceof SharedArrayBuffer) {
        let offset = Offsets.header_size;
        for (let i = 0; i < args.length; i++) {
          const param = signature.params[i];
          param.write(paramView, offset, args[i]);
          offset += param.size;
        }
        return [paramBuffer, wasmMemory, []];
      } else {
        const resultBuffer = new SharedArrayBuffer(transfer?.size ?? 0);
        let reverse = void 0;
        let offset = Offsets.header_size;
        let result_ptr = 0;
        if (MemoryTransfer.isCustom(transfer)) {
          reverse = transfer.copy(wasmMemory, args, paramBuffer, offset, resultBuffer);
        } else if (MemoryTransfer.isArguments(transfer)) {
          let transferIndex = 0;
          reverse = [];
          for (let i = 0; i < args.length; i++) {
            const param = signature.params[i];
            if (param.kind === 1 /* ptr */) {
              param.write(paramView, offset, result_ptr);
              const transferItem = transfer?.items[transferIndex++];
              if (transferItem === void 0) {
                throw new WasiError(Errno.inval);
              }
              reverse.push(transferItem.copy(wasmMemory, args[i], resultBuffer, result_ptr));
              result_ptr += transferItem.memorySize;
            } else {
              param.write(paramView, offset, args[i]);
            }
            offset += param.size;
          }
        } else {
          for (let i = 0; i < args.length; i++) {
            const param = signature.params[i];
            param.write(paramView, offset, args[i]);
            offset += param.size;
          }
        }
        return [paramBuffer, resultBuffer, reverse];
      }
    }
  };
  var WasiHost;
  ((WasiHost2) => {
    function create(connection) {
      let $instance;
      let $memory;
      const args_size = { count: 0, bufferSize: 0 };
      const environ_size = { count: 0, bufferSize: 0 };
      function memory() {
        if ($memory !== void 0) {
          return $memory.buffer;
        }
        if ($instance === void 0 || $instance.exports.memory === void 0) {
          throw new Error(`WASI layer is not initialized. Missing WebAssembly instance or memory module.`);
        }
        return $instance.exports.memory.buffer;
      }
      function memoryView() {
        if ($memory !== void 0) {
          return new DataView($memory.buffer);
        }
        if ($instance === void 0 || $instance.exports.memory === void 0) {
          throw new Error(`WASI layer is not initialized. Missing WebAssembly instance or memory module.`);
        }
        return new DataView($instance.exports.memory.buffer);
      }
      function handleError(error, def = Errno.badf) {
        if (error instanceof WasiError) {
          return error.errno;
        }
        return def;
      }
      const wasi = {
        initialize: (instOrMemory) => {
          if (instOrMemory instanceof WebAssembly.Instance) {
            $instance = instOrMemory;
            $memory = void 0;
          } else {
            $instance = void 0;
            $memory = instOrMemory;
          }
        },
        memory: () => {
          return memory();
        },
        args_sizes_get: (argvCount_ptr, argvBufSize_ptr) => {
          try {
            args_size.count = 0;
            args_size.bufferSize = 0;
            const result = connection.call(args_sizes_get, [argvCount_ptr, argvBufSize_ptr], memory(), args_sizes_get.transfers());
            if (result === Errno.success) {
              const view = memoryView();
              args_size.count = view.getUint32(argvCount_ptr, true);
              args_size.bufferSize = view.getUint32(argvBufSize_ptr, true);
            }
            return result;
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        args_get: (argv_ptr, argvBuf_ptr) => {
          if (args_size.count === 0 || args_size.bufferSize === 0) {
            return Errno.inval;
          }
          try {
            return connection.call(args_get, [argv_ptr, argvBuf_ptr], memory(), args_get.transfers(memoryView(), args_size.count, args_size.bufferSize));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        clock_res_get: (id, timestamp_ptr) => {
          try {
            return connection.call(clock_res_get, [id, timestamp_ptr], memory(), clock_res_get.transfers());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        clock_time_get: (id, precision, timestamp_ptr) => {
          try {
            return connection.call(clock_time_get, [id, precision, timestamp_ptr], memory(), clock_time_get.transfers());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        environ_sizes_get: (environCount_ptr, environBufSize_ptr) => {
          try {
            environ_size.count = 0;
            environ_size.bufferSize = 0;
            const result = connection.call(environ_sizes_get, [environCount_ptr, environBufSize_ptr], memory(), environ_sizes_get.transfers());
            if (result === Errno.success) {
              const view = memoryView();
              environ_size.count = view.getUint32(environCount_ptr, true);
              environ_size.bufferSize = view.getUint32(environBufSize_ptr, true);
            }
            return result;
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        environ_get: (environ_ptr, environBuf_ptr) => {
          if (environ_size.count === 0 || environ_size.bufferSize === 0) {
            return Errno.inval;
          }
          try {
            return connection.call(environ_get, [environ_ptr, environBuf_ptr], memory(), environ_get.transfers(memoryView(), environ_size.count, environ_size.bufferSize));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_advise: (fd3, offset, length, advise3) => {
          try {
            return connection.call(fd_advise, [fd3, offset, length, advise3], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_allocate: (fd3, offset, len) => {
          try {
            return connection.call(fd_allocate, [fd3, offset, len], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_close: (fd3) => {
          try {
            return connection.call(fd_close, [fd3], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_datasync: (fd3) => {
          try {
            return connection.call(fd_datasync, [fd3], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_fdstat_get: (fd3, fdstat_ptr) => {
          try {
            return connection.call(fd_fdstat_get, [fd3, fdstat_ptr], memory(), fd_fdstat_get.transfers());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_fdstat_set_flags: (fd3, fdflags3) => {
          try {
            return connection.call(fd_fdstat_set_flags, [fd3, fdflags3], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_filestat_get: (fd3, filestat_ptr) => {
          try {
            return connection.call(fd_filestat_get, [fd3, filestat_ptr], memory(), fd_filestat_get.transfers());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_filestat_set_size: (fd3, size) => {
          try {
            return connection.call(fd_filestat_set_size, [fd3, size], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_filestat_set_times: (fd3, atim, mtim, fst_flags) => {
          try {
            return connection.call(fd_filestat_set_times, [fd3, atim, mtim, fst_flags], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_pread: (fd3, iovs_ptr, iovs_len, offset, bytesRead_ptr) => {
          try {
            return connection.call(fd_pread, [fd3, iovs_ptr, iovs_len, offset, bytesRead_ptr], memory(), fd_pread.transfers(memoryView(), iovs_ptr, iovs_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_prestat_get: (fd3, bufPtr) => {
          try {
            return connection.call(fd_prestat_get, [fd3, bufPtr], memory(), fd_prestat_get.transfers());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_prestat_dir_name: (fd3, pathPtr, pathLen) => {
          try {
            return connection.call(fd_prestat_dir_name, [fd3, pathPtr, pathLen], memory(), fd_prestat_dir_name.transfers(memoryView(), pathPtr, pathLen));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_pwrite: (fd3, ciovs_ptr, ciovs_len, offset, bytesWritten_ptr) => {
          try {
            return connection.call(fd_pwrite, [fd3, ciovs_ptr, ciovs_len, offset, bytesWritten_ptr], memory(), fd_pwrite.transfers(memoryView(), ciovs_ptr, ciovs_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_read: (fd3, iovs_ptr, iovs_len, bytesRead_ptr) => {
          try {
            return connection.call(fd_read, [fd3, iovs_ptr, iovs_len, bytesRead_ptr], memory(), fd_read.transfers(memoryView(), iovs_ptr, iovs_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_readdir: (fd3, buf_ptr, buf_len, cookie, buf_used_ptr) => {
          try {
            return connection.call(fd_readdir, [fd3, buf_ptr, buf_len, cookie, buf_used_ptr], memory(), fd_readdir.transfers(memoryView(), buf_ptr, buf_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_seek: (fd3, offset, whence3, new_offset_ptr) => {
          try {
            return connection.call(fd_seek, [fd3, offset, whence3, new_offset_ptr], memory(), fd_seek.transfers());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_renumber: (fd3, to) => {
          try {
            return connection.call(fd_renumber, [fd3, to], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_sync: (fd3) => {
          try {
            return connection.call(fd_sync, [fd3], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_tell: (fd3, offset_ptr) => {
          try {
            return connection.call(fd_tell, [fd3, offset_ptr], memory(), fd_tell.transfers());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        fd_write: (fd3, ciovs_ptr, ciovs_len, bytesWritten_ptr) => {
          try {
            return connection.call(fd_write, [fd3, ciovs_ptr, ciovs_len, bytesWritten_ptr], memory(), fd_write.transfers(memoryView(), ciovs_ptr, ciovs_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        path_create_directory: (fd3, path_ptr, path_len) => {
          try {
            return connection.call(path_create_directory, [fd3, path_ptr, path_len], memory(), path_create_directory.transfers(memoryView(), path_ptr, path_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        path_filestat_get: (fd3, flags, path_ptr, path_len, filestat_ptr) => {
          try {
            return connection.call(path_filestat_get, [fd3, flags, path_ptr, path_len, filestat_ptr], memory(), path_filestat_get.transfers(memoryView(), path_ptr, path_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        path_filestat_set_times: (fd3, flags, path_ptr, path_len, atim, mtim, fst_flags) => {
          try {
            return connection.call(path_filestat_set_times, [fd3, flags, path_ptr, path_len, atim, mtim, fst_flags], memory(), path_filestat_set_times.transfers(memoryView(), path_ptr, path_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        path_link: (old_fd, old_flags, old_path_ptr, old_path_len, new_fd, new_path_ptr, new_path_len) => {
          try {
            return connection.call(path_link, [old_fd, old_flags, old_path_ptr, old_path_len, new_fd, new_path_ptr, new_path_len], memory(), path_link.transfers(memoryView(), old_path_ptr, old_path_len, new_path_ptr, new_path_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        path_open: (fd3, dirflags, path_ptr, path_len, oflags3, fs_rights_base, fs_rights_inheriting, fdflags3, fd_ptr) => {
          try {
            return connection.call(path_open, [fd3, dirflags, path_ptr, path_len, oflags3, fs_rights_base, fs_rights_inheriting, fdflags3, fd_ptr], memory(), path_open.transfers(memoryView(), path_ptr, path_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        path_readlink: (fd3, path_ptr, path_len, buf_ptr, buf_len, result_size_ptr) => {
          try {
            return connection.call(path_readlink, [fd3, path_ptr, path_len, buf_ptr, buf_len, result_size_ptr], memory(), path_readlink.transfers(memoryView(), path_ptr, path_len, buf_ptr, buf_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        path_remove_directory: (fd3, path_ptr, path_len) => {
          try {
            return connection.call(path_remove_directory, [fd3, path_ptr, path_len], memory(), path_remove_directory.transfers(memoryView(), path_ptr, path_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        path_rename: (old_fd, old_path_ptr, old_path_len, new_fd, new_path_ptr, new_path_len) => {
          try {
            return connection.call(path_rename, [old_fd, old_path_ptr, old_path_len, new_fd, new_path_ptr, new_path_len], memory(), path_rename.transfers(memoryView(), old_path_ptr, old_path_len, new_path_ptr, new_path_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        path_symlink: (old_path_ptr, old_path_len, fd3, new_path_ptr, new_path_len) => {
          try {
            return connection.call(path_symlink, [old_path_ptr, old_path_len, fd3, new_path_ptr, new_path_len], memory(), path_symlink.transfers(memoryView(), old_path_ptr, old_path_len, new_path_ptr, new_path_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        path_unlink_file: (fd3, path_ptr, path_len) => {
          try {
            return connection.call(path_unlink_file, [fd3, path_ptr, path_len], memory(), path_unlink_file.transfers(memoryView(), path_ptr, path_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        poll_oneoff: (input, output, subscriptions, result_size_ptr) => {
          try {
            return connection.call(poll_oneoff, [input, output, subscriptions, result_size_ptr], memory(), poll_oneoff.transfers(memoryView(), input, output, subscriptions));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        proc_exit: (rval) => {
          try {
            return connection.call(proc_exit, [rval], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        sched_yield: () => {
          try {
            return connection.call(sched_yield, [], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        thread_exit: (tid) => {
          try {
            return connection.call(thread_exit, [tid], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        random_get: (buf, buf_len) => {
          try {
            return connection.call(random_get, [buf, buf_len], memory(), random_get.transfers(memoryView(), buf, buf_len));
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        sock_accept: (_fd, _flags, _result_fd_ptr) => {
          try {
            return connection.call(sock_accept, [_fd, _flags, _result_fd_ptr], memory(), sock_accept.transfers());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        sock_recv: (_fd, _ri_data_ptr, _ri_data_len, _ri_flags, _ro_datalen_ptr, _roflags_ptr) => {
          return Errno.nosys;
        },
        sock_send: (_fd, _si_data_ptr, _si_data_len, _si_flags, _si_datalen_ptr) => {
          return Errno.nosys;
        },
        sock_shutdown: (fd3, sdflags3) => {
          try {
            return connection.call(sock_shutdown, [fd3, sdflags3], memory());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        },
        "thread-spawn": (start_args_ptr) => {
          try {
            return connection.call(thread_spawn, [start_args_ptr], memory(), thread_spawn.transfers());
          } catch (error) {
            return handleError(error, Errno.inval);
          }
        }
      };
      return wasi;
    }
    WasiHost2.create = create;
  })(WasiHost || (WasiHost = {}));
  var TraceWasiHost;
  ((TraceWasiHost2) => {
    function create(connection, host) {
      const timePerFunction = /* @__PURE__ */ new Map();
      const traceMessage = TraceMessage2.create();
      function printSummary() {
        const summary = [];
        for (const [name, { count, time }] of timePerFunction.entries()) {
          summary.push(`${name} was called ${count} times and took ${time}ms in total. Average time: ${time / count}ms.`);
        }
        connection.postMessage({ method: "traceSummary", summary });
      }
      const proxy = new Proxy(host, {
        get: (target, property, receiver) => {
          const value = Reflect.get(target, property, receiver);
          const propertyName = property.toString();
          if (typeof value === "function") {
            return (...args) => {
              if (propertyName === "proc_exit") {
                printSummary();
              }
              const start = Date.now();
              const result = value.apply(target, args);
              const timeTaken = Date.now() - start;
              const traceFunction = traceMessage[propertyName];
              const message = traceFunction !== void 0 ? traceFunction(host.memory(), result, ...args) : `Missing trace function for ${propertyName}. Execution took ${timeTaken}ms.`;
              connection.postMessage({ method: "trace", message, timeTaken });
              if (propertyName !== "fd_read" || args[0] !== 0 && args[0] !== 1 && args[0] !== 2) {
                let perFunction = timePerFunction.get(property.toString());
                if (perFunction === void 0) {
                  perFunction = { count: 0, time: 0 };
                  timePerFunction.set(property.toString(), perFunction);
                }
                perFunction.count++;
                perFunction.time += timeTaken;
              }
              return result;
            };
          } else {
            return value;
          }
        }
      });
      return {
        tracer: proxy,
        printSummary
      };
    }
    TraceWasiHost2.create = create;
  })(TraceWasiHost || (TraceWasiHost = {}));

  // src/web/connection.ts
  var BrowserHostConnection = class extends HostConnection {
    constructor(port) {
      super();
      __publicField(this, "port");
      this.port = port;
      this.port.onmessage = (event3) => {
        this.handleMessage(event3.data).catch(ral_default().console.error);
      };
    }
    postMessage(message) {
      this.port.postMessage(message);
    }
    destroy() {
      this.port.onmessage = null;
    }
  };

  // src/common/promises.ts
  var CapturedPromise;
  ((CapturedPromise2) => {
    function create() {
      let _resolve;
      let _reject;
      const promise = new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
      });
      return {
        promise,
        resolve: _resolve,
        reject: _reject
      };
    }
    CapturedPromise2.create = create;
  })(CapturedPromise || (CapturedPromise = {}));

  // src/web/mainWorker.ts
  ril_default.install();
  var MainBrowserHostConnection = class extends BrowserHostConnection {
    constructor(port) {
      super(port);
      __publicField(this, "_done");
      this._done = CapturedPromise.create();
    }
    done() {
      return this._done.promise;
    }
    async handleMessage(message) {
      if (StartMainMessage.is(message)) {
        const module = message.module;
        const memory = message.memory;
        let host = WasiHost.create(this);
        let tracer;
        if (message.trace) {
          tracer = TraceWasiHost.create(this, host);
          host = tracer.tracer;
        }
        const imports = {
          wasi_snapshot_preview1: host,
          wasi: host
        };
        if (memory !== void 0) {
          imports.env = {
            memory
          };
        }
        const instance = await WebAssembly.instantiate(module, imports);
        host.initialize(memory ?? instance);
        instance.exports._start();
        if (tracer !== void 0) {
          tracer.printSummary();
        }
        this._done.resolve();
      }
    }
  };
  async function main(port) {
    const connection = new MainBrowserHostConnection(port);
    try {
      const ready = { method: "workerReady" };
      connection.postMessage(ready);
      await connection.done();
    } finally {
      connection.postMessage({ method: "workerDone" });
      connection.destroy();
    }
  }
  main(self).catch(ril_default().console.error).finally(() => close());
})();
//# sourceMappingURL=mainWorker.js.map
