"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/desktop/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);

// src/desktop/ril.ts
var crypto = __toESM(require("crypto"));
var path = __toESM(require("path"));
var import_util = require("util");

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

// src/desktop/ril.ts
var _ril = Object.freeze({
  TextEncoder: Object.freeze({
    create(encoding = "utf-8") {
      return {
        encode(input) {
          return Buffer.from(input ?? "", encoding);
        }
      };
    }
  }),
  TextDecoder: Object.freeze({
    create(encoding = "utf-8") {
      return new import_util.TextDecoder(encoding);
    }
  }),
  console,
  timer: Object.freeze({
    setTimeout(callback, ms, ...args) {
      const handle = setTimeout(callback, ms, ...args);
      return { dispose: () => clearTimeout(handle) };
    },
    setImmediate(callback, ...args) {
      const handle = setImmediate(callback, ...args);
      return { dispose: () => clearImmediate(handle) };
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
      return process.hrtime.bigint();
    }
  }),
  crypto: Object.freeze({
    randomGet(size) {
      const result = new Uint8Array(size);
      crypto.randomFillSync(result);
      return result;
    }
  }),
  path: path.posix,
  workbench: Object.freeze({
    hasTrash: true
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

// src/desktop/extension.ts
var import_vscode13 = require("vscode");

// src/common/wasiMeta.ts
var ptr_size = 4;
var PtrParam = { kind: 1 /* ptr */, size: ptr_size, write: (view, offset, value) => view.setUint32(offset, value, true), read: (view, offset) => view.getUint32(offset, true) };
var WasiFunctionSignature;
((WasiFunctionSignature3) => {
  function create8(params) {
    return {
      params,
      memorySize: getMemorySize(params)
    };
  }
  WasiFunctionSignature3.create = create8;
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
  function create8(items) {
    return {
      items,
      size: getMemorySize(items)
    };
  }
  ArgumentsTransfer2.create = create8;
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
  function contains(rights12, check) {
    return (rights12 & check) === check;
  }
  Rights2.contains = contains;
  function supportFdflags(rights12, fdflags11) {
    if (fdflags11 === Fdflags.none) {
      return true;
    }
    if (Fdflags.dsyncOn(fdflags11)) {
      return contains(rights12, Rights2.fd_datasync | Rights2.fd_sync);
    }
    if (Fdflags.rsyncOn(fdflags11)) {
      return contains(rights12, Rights2.fd_sync);
    }
    return true;
  }
  Rights2.supportFdflags = supportFdflags;
  function supportOflags(rights12, oflags8) {
    if (oflags8 === Oflags.none) {
      return true;
    }
    if (Oflags.creatOn(oflags8)) {
      return contains(rights12, Rights2.path_create_file);
    }
    if (Oflags.truncOn(oflags8)) {
      return contains(rights12, Rights2.path_filestat_set_size);
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
((Filetype3) => {
  Filetype3.unknown = 0;
  Filetype3.block_device = 1;
  Filetype3.character_device = 2;
  Filetype3.directory = 3;
  Filetype3.regular_file = 4;
  Filetype3.socket_dgram = 5;
  Filetype3.socket_stream = 6;
  Filetype3.symbolic_link = 7;
  function toString(value) {
    switch (value) {
      case Filetype3.unknown:
        return "unknown";
      case Filetype3.block_device:
        return "block_device";
      case Filetype3.character_device:
        return "character_device";
      case Filetype3.directory:
        return "directory";
      case Filetype3.regular_file:
        return "regular_file";
      case Filetype3.socket_dgram:
        return "socket_dgram";
      case Filetype3.socket_stream:
        return "socket_stream";
      case Filetype3.symbolic_link:
        return "symbolic_link";
      default:
        return value.toString();
    }
  }
  Filetype3.toString = toString;
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
  function create8(memory, ptr) {
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
  Filestat2.create = create8;
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
  function create8(memory, ptr) {
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
  Fdstat2.create = create8;
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
  function create8(memory, ptr) {
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
  Prestat2.create = create8;
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
  function create8(memory, ptr) {
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
  Iovec2.create = create8;
})(Iovec || (Iovec = {}));
((Iovec2) => {
  Iovec2.$ptr = Ptr.$param;
  function createTransfer(memory, iovec2, iovs_len) {
    let dataSize = Iovec2.size * iovs_len;
    for (const item of new StructArray(memory, iovec2, iovs_len, Iovec2).values()) {
      dataSize += item.buf_len;
    }
    return {
      memorySize: dataSize,
      copy: (wasmMemory, from, transferMemory, to) => {
        if (from !== iovec2) {
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
  function create8(memory, ptr) {
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
  Ciovec2.create = create8;
})(Ciovec || (Ciovec = {}));
((Ciovec2) => {
  Ciovec2.$ptr = Ptr.$param;
  function createTransfer(memory, ciovec2, ciovs_len) {
    let dataSize = Ciovec2.size * ciovs_len;
    for (const item of new StructArray(memory, ciovec2, ciovs_len, Ciovec2).values()) {
      dataSize += item.buf_len;
    }
    return {
      memorySize: dataSize,
      copy: (wasmMemory, from, transferMemory, to) => {
        if (from !== ciovec2) {
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
  function create8(memory, ptr) {
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
  Dirent2.create = create8;
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
  function create8(memory, ptr) {
    return {
      set nbytes(value) {
        memory.setBigUint64(ptr + offsets.nbytes, value, true);
      },
      set flags(value) {
        memory.setUint16(ptr + offsets.flags, value, true);
      }
    };
  }
  Event_fd_readwrite2.create = create8;
})(Event_fd_readwrite || (Event_fd_readwrite = {}));
var Event;
((Event4) => {
  Event4.size = 32;
  Event4.alignment = 8;
  const offsets = {
    userdata: 0,
    error: 8,
    type: 10,
    fd_readwrite: 16
  };
  function create8(memory, ptr) {
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
  Event4.create = create8;
})(Event || (Event = {}));
((Event4) => {
  Event4.$ptr = Ptr.$param;
  function createTransfer(length) {
    return Bytes.createTransfer(Event4.size * length, 2 /* result */);
  }
  Event4.createTransfer = createTransfer;
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
  function create8(memory, ptr) {
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
  Subscription_clock2.create = create8;
})(Subscription_clock || (Subscription_clock = {}));
var Subscription_fd_readwrite;
((Subscription_fd_readwrite2) => {
  Subscription_fd_readwrite2.size = 4;
  Subscription_fd_readwrite2.alignment = 4;
  const offsets = {
    file_descriptor: 0
  };
  function create8(memory, ptr) {
    return {
      get file_descriptor() {
        return memory.getUint32(ptr + offsets.file_descriptor, true);
      }
    };
  }
  Subscription_fd_readwrite2.create = create8;
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
  function create8(memory, ptr) {
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
  Subscription_u2.create = create8;
})(Subscription_u || (Subscription_u = {}));
var Subscription;
((Subscription2) => {
  Subscription2.size = 48;
  Subscription2.alignment = 8;
  const offsets = {
    userdata: 0,
    u: 8
  };
  function create8(memory, ptr) {
    return {
      get userdata() {
        return memory.getBigUint64(ptr + offsets.userdata, true);
      },
      get u() {
        return Subscription_u.create(memory, ptr + offsets.u);
      }
    };
  }
  Subscription2.create = create8;
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
((args_sizes_get3) => {
  args_sizes_get3.name = "args_sizes_get";
  args_sizes_get3.signature = WasiFunctionSignature.create([U32.$ptr, U32.$ptr]);
  const _transfers = ArgumentsTransfer.create([U32.$transfer, U32.$transfer]);
  function transfers() {
    return _transfers;
  }
  args_sizes_get3.transfers = transfers;
  WasiFunctions.add(args_sizes_get3);
})(args_sizes_get || (args_sizes_get = {}));
var args_get;
((args_get3) => {
  args_get3.name = "args_get";
  args_get3.signature = WasiFunctionSignature.create([Ptr.$param, Ptr.$param]);
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
  args_get3.transfers = transfers;
  WasiFunctions.add(args_get3);
})(args_get || (args_get = {}));
var clock_res_get;
((clock_res_get3) => {
  clock_res_get3.name = "clock_res_get";
  clock_res_get3.signature = WasiFunctionSignature.create([Clockid.$param, Timestamp.$ptr]);
  const _transfers = ArgumentsTransfer.create([Timestamp.$transfer]);
  function transfers() {
    return _transfers;
  }
  clock_res_get3.transfers = transfers;
  WasiFunctions.add(clock_res_get3);
})(clock_res_get || (clock_res_get = {}));
var clock_time_get;
((clock_time_get3) => {
  clock_time_get3.name = "clock_time_get";
  clock_time_get3.signature = WasiFunctionSignature.create([Clockid.$param, Timestamp.$param, Timestamp.$ptr]);
  const _transfers = ArgumentsTransfer.create([Timestamp.$transfer]);
  function transfers() {
    return _transfers;
  }
  clock_time_get3.transfers = transfers;
  WasiFunctions.add(clock_time_get3);
})(clock_time_get || (clock_time_get = {}));
var environ_sizes_get;
((environ_sizes_get3) => {
  environ_sizes_get3.name = "environ_sizes_get";
  environ_sizes_get3.signature = WasiFunctionSignature.create([U32.$ptr, U32.$ptr]);
  const _transfers = ArgumentsTransfer.create([U32.$transfer, U32.$transfer]);
  function transfers() {
    return _transfers;
  }
  environ_sizes_get3.transfers = transfers;
  WasiFunctions.add(environ_sizes_get3);
})(environ_sizes_get || (environ_sizes_get = {}));
var environ_get;
((environ_get3) => {
  environ_get3.name = "environ_get";
  environ_get3.signature = WasiFunctionSignature.create([Ptr.$param, Ptr.$param]);
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
  environ_get3.transfers = transfers;
  WasiFunctions.add(environ_get3);
})(environ_get || (environ_get = {}));
var fd_advise;
((fd_advise3) => {
  fd_advise3.name = "fd_advise";
  fd_advise3.signature = WasiFunctionSignature.create([Fd.$param, Filesize.$param, Filesize.$param, Advise.$param]);
  WasiFunctions.add(fd_advise3);
})(fd_advise || (fd_advise = {}));
var fd_allocate;
((fd_allocate3) => {
  fd_allocate3.name = "fd_allocate";
  fd_allocate3.signature = WasiFunctionSignature.create([Fd.$param, Filesize.$param, Filesize.$param]);
  WasiFunctions.add(fd_allocate3);
})(fd_allocate || (fd_allocate = {}));
var fd_close;
((fd_close3) => {
  fd_close3.name = "fd_close";
  fd_close3.signature = WasiFunctionSignature.create([Fd.$param]);
  WasiFunctions.add(fd_close3);
})(fd_close || (fd_close = {}));
var fd_datasync;
((fd_datasync3) => {
  fd_datasync3.name = "fd_datasync";
  fd_datasync3.signature = WasiFunctionSignature.create([Fd.$param]);
  WasiFunctions.add(fd_datasync3);
})(fd_datasync || (fd_datasync = {}));
var fd_fdstat_get;
((fd_fdstat_get3) => {
  fd_fdstat_get3.name = "fd_fdstat_get";
  fd_fdstat_get3.signature = WasiFunctionSignature.create([Fd.$param, Fdstat.$ptr]);
  const _transfers = ArgumentsTransfer.create([Fdstat.$transfer]);
  function transfers() {
    return _transfers;
  }
  fd_fdstat_get3.transfers = transfers;
  WasiFunctions.add(fd_fdstat_get3);
})(fd_fdstat_get || (fd_fdstat_get = {}));
var fd_fdstat_set_flags;
((fd_fdstat_set_flags3) => {
  fd_fdstat_set_flags3.name = "fd_fdstat_set_flags";
  fd_fdstat_set_flags3.signature = WasiFunctionSignature.create([Fd.$param, Fdflags.$param]);
  WasiFunctions.add(fd_fdstat_set_flags3);
})(fd_fdstat_set_flags || (fd_fdstat_set_flags = {}));
var fd_filestat_get;
((fd_filestat_get3) => {
  fd_filestat_get3.name = "fd_filestat_get";
  fd_filestat_get3.signature = WasiFunctionSignature.create([Fd.$param, Filestat.$ptr]);
  const _transfers = ArgumentsTransfer.create([Filestat.$transfer]);
  function transfers() {
    return _transfers;
  }
  fd_filestat_get3.transfers = transfers;
  WasiFunctions.add(fd_filestat_get3);
})(fd_filestat_get || (fd_filestat_get = {}));
var fd_filestat_set_size;
((fd_filestat_set_size3) => {
  fd_filestat_set_size3.name = "fd_filestat_set_size";
  fd_filestat_set_size3.signature = WasiFunctionSignature.create([Fd.$param, Filesize.$param]);
  WasiFunctions.add(fd_filestat_set_size3);
})(fd_filestat_set_size || (fd_filestat_set_size = {}));
var fd_filestat_set_times;
((fd_filestat_set_times3) => {
  fd_filestat_set_times3.name = "fd_filestat_set_times";
  fd_filestat_set_times3.signature = WasiFunctionSignature.create([Fd.$param, Timestamp.$param, Timestamp.$param, Fstflags.$param]);
  WasiFunctions.add(fd_filestat_set_times3);
})(fd_filestat_set_times || (fd_filestat_set_times = {}));
var fd_pread;
((fd_pread3) => {
  fd_pread3.name = "fd_pread";
  fd_pread3.signature = WasiFunctionSignature.create([Fd.$param, Iovec.$ptr, U32.$param, Filesize.$param, U32.$ptr]);
  function transfers(memory, iovs_ptr, iovs_len) {
    return ArgumentsTransfer.create([Iovec.createTransfer(memory, iovs_ptr, iovs_len), U32.$transfer]);
  }
  fd_pread3.transfers = transfers;
  WasiFunctions.add(fd_pread3);
})(fd_pread || (fd_pread = {}));
var fd_prestat_get;
((fd_prestat_get3) => {
  fd_prestat_get3.name = "fd_prestat_get";
  fd_prestat_get3.signature = WasiFunctionSignature.create([Fd.$param, Prestat.$ptr]);
  const _transfers = ArgumentsTransfer.create([Prestat.$transfer]);
  function transfers() {
    return _transfers;
  }
  fd_prestat_get3.transfers = transfers;
  WasiFunctions.add(fd_prestat_get3);
})(fd_prestat_get || (fd_prestat_get = {}));
var fd_prestat_dir_name;
((fd_prestat_dir_name3) => {
  fd_prestat_dir_name3.name = "fd_prestat_dir_name";
  fd_prestat_dir_name3.signature = WasiFunctionSignature.create([Fd.$param, WasiPath.$ptr, WasiPath.$len]);
  function transfers(_memory, _pathPtr, pathLen) {
    return ArgumentsTransfer.create([WasiPath.createTransfer(pathLen, 2 /* result */)]);
  }
  fd_prestat_dir_name3.transfers = transfers;
  WasiFunctions.add(fd_prestat_dir_name3);
})(fd_prestat_dir_name || (fd_prestat_dir_name = {}));
var fd_pwrite;
((fd_pwrite3) => {
  fd_pwrite3.name = "fd_pwrite";
  fd_pwrite3.signature = WasiFunctionSignature.create([Fd.$param, Ciovec.$ptr, U32.$param, Filesize.$param, U32.$ptr]);
  function transfers(memory, ciovs_ptr, ciovs_len) {
    return ArgumentsTransfer.create([Ciovec.createTransfer(memory, ciovs_ptr, ciovs_len), U32.$transfer]);
  }
  fd_pwrite3.transfers = transfers;
  WasiFunctions.add(fd_pwrite3);
})(fd_pwrite || (fd_pwrite = {}));
var fd_read;
((fd_read3) => {
  fd_read3.name = "fd_read";
  fd_read3.signature = WasiFunctionSignature.create([Fd.$param, Iovec.$ptr, U32.$param, U32.$ptr]);
  function transfers(memory, iovs_ptr, iovs_len) {
    return ArgumentsTransfer.create([Iovec.createTransfer(memory, iovs_ptr, iovs_len), U32.$transfer]);
  }
  fd_read3.transfers = transfers;
  WasiFunctions.add(fd_read3);
})(fd_read || (fd_read = {}));
var fd_readdir;
((fd_readdir3) => {
  fd_readdir3.name = "fd_readdir";
  fd_readdir3.signature = WasiFunctionSignature.create([Fd.$param, Dirent.$ptr, Size.$param, Dircookie.$param, U32.$ptr]);
  function transfers(_memory, _buf_ptr, buf_len) {
    return ArgumentsTransfer.create([Dirent.createTransfer(buf_len), U32.$transfer]);
  }
  fd_readdir3.transfers = transfers;
  WasiFunctions.add(fd_readdir3);
})(fd_readdir || (fd_readdir = {}));
var fd_renumber;
((fd_renumber3) => {
  fd_renumber3.name = "fd_renumber";
  fd_renumber3.signature = WasiFunctionSignature.create([Fd.$param, Fd.$param]);
  WasiFunctions.add(fd_renumber3);
})(fd_renumber || (fd_renumber = {}));
var fd_seek;
((fd_seek3) => {
  fd_seek3.name = "fd_seek";
  fd_seek3.signature = WasiFunctionSignature.create([Fd.$param, Filedelta.$param, Whence.$param, U64.$ptr]);
  const _transfers = ArgumentsTransfer.create([U64.$transfer]);
  function transfers() {
    return _transfers;
  }
  fd_seek3.transfers = transfers;
  WasiFunctions.add(fd_seek3);
})(fd_seek || (fd_seek = {}));
var fd_sync;
((fd_sync3) => {
  fd_sync3.name = "fd_sync";
  fd_sync3.signature = WasiFunctionSignature.create([Fd.$param]);
  WasiFunctions.add(fd_sync3);
})(fd_sync || (fd_sync = {}));
var fd_tell;
((fd_tell3) => {
  fd_tell3.name = "fd_tell";
  fd_tell3.signature = WasiFunctionSignature.create([Fd.$param, U64.$ptr]);
  const _transfers = ArgumentsTransfer.create([U64.$transfer]);
  function transfers() {
    return _transfers;
  }
  fd_tell3.transfers = transfers;
  WasiFunctions.add(fd_tell3);
})(fd_tell || (fd_tell = {}));
var fd_write;
((fd_write3) => {
  fd_write3.name = "fd_write";
  fd_write3.signature = WasiFunctionSignature.create([Fd.$param, Ciovec.$ptr, U32.$param, U32.$ptr]);
  function transfers(memory, ciovs_ptr, ciovs_len) {
    return ArgumentsTransfer.create([Ciovec.createTransfer(memory, ciovs_ptr, ciovs_len), U32.$transfer]);
  }
  fd_write3.transfers = transfers;
  WasiFunctions.add(fd_write3);
})(fd_write || (fd_write = {}));
var path_create_directory;
((path_create_directory3) => {
  path_create_directory3.name = "path_create_directory";
  path_create_directory3.signature = WasiFunctionSignature.create([Fd.$param, WasiPath.$ptr, WasiPath.$len]);
  function transfers(_memory, _path_ptr, path_len) {
    return ArgumentsTransfer.create([WasiPath.createTransfer(path_len, 1 /* param */)]);
  }
  path_create_directory3.transfers = transfers;
  WasiFunctions.add(path_create_directory3);
})(path_create_directory || (path_create_directory = {}));
var path_filestat_get;
((path_filestat_get3) => {
  path_filestat_get3.name = "path_filestat_get";
  path_filestat_get3.signature = WasiFunctionSignature.create([Fd.$param, Lookupflags.$param, WasiPath.$ptr, WasiPath.$len, Filestat.$ptr]);
  function transfers(_memory, _path_ptr, path_len) {
    return ArgumentsTransfer.create([WasiPath.createTransfer(path_len, 1 /* param */), Filestat.$transfer]);
  }
  path_filestat_get3.transfers = transfers;
  WasiFunctions.add(path_filestat_get3);
})(path_filestat_get || (path_filestat_get = {}));
var path_filestat_set_times;
((path_filestat_set_times3) => {
  path_filestat_set_times3.name = "path_filestat_set_times";
  path_filestat_set_times3.signature = WasiFunctionSignature.create([Fd.$param, Lookupflags.$param, WasiPath.$ptr, WasiPath.$len, Timestamp.$param, Timestamp.$param, Fstflags.$param]);
  function transfers(_memory, _path_ptr, path_len) {
    return ArgumentsTransfer.create([WasiPath.createTransfer(path_len, 1 /* param */)]);
  }
  path_filestat_set_times3.transfers = transfers;
  WasiFunctions.add(path_filestat_set_times3);
})(path_filestat_set_times || (path_filestat_set_times = {}));
var path_link;
((path_link3) => {
  path_link3.name = "path_link";
  path_link3.signature = WasiFunctionSignature.create([Fd.$param, Lookupflags.$param, WasiPath.$ptr, WasiPath.$len, Fd.$param, WasiPath.$ptr, WasiPath.$len]);
  function transfers(_memory, _old_path_ptr, old_path_len, _new_path_ptr, new_path_len) {
    return ArgumentsTransfer.create([WasiPath.createTransfer(old_path_len, 1 /* param */), WasiPath.createTransfer(new_path_len, 1 /* param */)]);
  }
  path_link3.transfers = transfers;
  WasiFunctions.add(path_link3);
})(path_link || (path_link = {}));
var path_open;
((path_open3) => {
  path_open3.name = "path_open";
  path_open3.signature = WasiFunctionSignature.create([Fd.$param, Lookupflags.$param, WasiPath.$ptr, WasiPath.$len, Oflags.$param, Rights.$param, Rights.$param, Fdflags.$param, Fd.$ptr]);
  function transfers(_memory, _path, pathLen) {
    return ArgumentsTransfer.create([WasiPath.createTransfer(pathLen, 1 /* param */), Fd.$transfer]);
  }
  path_open3.transfers = transfers;
  WasiFunctions.add(path_open3);
})(path_open || (path_open = {}));
var path_readlink;
((path_readlink3) => {
  path_readlink3.name = "path_readlink";
  path_readlink3.signature = WasiFunctionSignature.create([Fd.$param, WasiPath.$ptr, WasiPath.$len, Bytes.$ptr, Size.$param, U32.$ptr]);
  function transfers(_memory, _path_ptr, path_len, _buf, buf_len) {
    return ArgumentsTransfer.create([WasiPath.createTransfer(path_len, 1 /* param */), Bytes.createTransfer(buf_len, 2 /* result */), U32.$transfer]);
  }
  path_readlink3.transfers = transfers;
  WasiFunctions.add(path_readlink3);
})(path_readlink || (path_readlink = {}));
var path_remove_directory;
((path_remove_directory3) => {
  path_remove_directory3.name = "path_remove_directory";
  path_remove_directory3.signature = WasiFunctionSignature.create([Fd.$param, WasiPath.$ptr, WasiPath.$len]);
  function transfers(_memory, _path_ptr, path_len) {
    return ArgumentsTransfer.create([WasiPath.createTransfer(path_len, 1 /* param */)]);
  }
  path_remove_directory3.transfers = transfers;
  WasiFunctions.add(path_remove_directory3);
})(path_remove_directory || (path_remove_directory = {}));
var path_rename;
((path_rename3) => {
  path_rename3.name = "path_rename";
  path_rename3.signature = WasiFunctionSignature.create([Fd.$param, WasiPath.$ptr, WasiPath.$len, Fd.$param, WasiPath.$ptr, WasiPath.$len]);
  function transfers(_memory, _old_path_ptr, old_path_len, _new_path_ptr, new_path_len) {
    return ArgumentsTransfer.create([WasiPath.createTransfer(old_path_len, 1 /* param */), WasiPath.createTransfer(new_path_len, 1 /* param */)]);
  }
  path_rename3.transfers = transfers;
  WasiFunctions.add(path_rename3);
})(path_rename || (path_rename = {}));
var path_symlink;
((path_symlink3) => {
  path_symlink3.name = "path_symlink";
  path_symlink3.signature = WasiFunctionSignature.create([WasiPath.$ptr, WasiPath.$len, Fd.$param, WasiPath.$ptr, WasiPath.$len]);
  function transfers(_memory, _old_path_ptr, old_path_len, _new_path_ptr, new_path_len) {
    return ArgumentsTransfer.create([WasiPath.createTransfer(old_path_len, 1 /* param */), WasiPath.createTransfer(new_path_len, 1 /* param */)]);
  }
  path_symlink3.transfers = transfers;
  WasiFunctions.add(path_symlink3);
})(path_symlink || (path_symlink = {}));
var path_unlink_file;
((path_unlink_file3) => {
  path_unlink_file3.name = "path_unlink_file";
  path_unlink_file3.signature = WasiFunctionSignature.create([Fd.$param, WasiPath.$ptr, WasiPath.$len]);
  function transfers(_memory, _path_ptr, path_len) {
    return ArgumentsTransfer.create([WasiPath.createTransfer(path_len, 1 /* param */)]);
  }
  path_unlink_file3.transfers = transfers;
  WasiFunctions.add(path_unlink_file3);
})(path_unlink_file || (path_unlink_file = {}));
var poll_oneoff;
((poll_oneoff3) => {
  poll_oneoff3.name = "poll_oneoff";
  poll_oneoff3.signature = WasiFunctionSignature.create([Subscription.$ptr, Event.$ptr, Size.$param, U32.$ptr]);
  function transfers(_memory, _input, _output, subscriptions) {
    return ArgumentsTransfer.create([Subscription.createTransfer(subscriptions), Event.createTransfer(subscriptions), U32.$transfer]);
  }
  poll_oneoff3.transfers = transfers;
  WasiFunctions.add(poll_oneoff3);
})(poll_oneoff || (poll_oneoff = {}));
var proc_exit;
((proc_exit3) => {
  proc_exit3.name = "proc_exit";
  proc_exit3.signature = WasiFunctionSignature.create([Exitcode.$param]);
  WasiFunctions.add(proc_exit3);
})(proc_exit || (proc_exit = {}));
var sched_yield;
((sched_yield3) => {
  sched_yield3.name = "sched_yield";
  sched_yield3.signature = WasiFunctionSignature.create([]);
  WasiFunctions.add(sched_yield3);
})(sched_yield || (sched_yield = {}));
var random_get;
((random_get3) => {
  random_get3.name = "random_get";
  random_get3.signature = WasiFunctionSignature.create([Byte.$ptr, Size.$param]);
  function transfers(_memory, _buf, buf_len) {
    return ArgumentsTransfer.create([Bytes.createTransfer(buf_len, 2 /* result */)]);
  }
  random_get3.transfers = transfers;
  WasiFunctions.add(random_get3);
})(random_get || (random_get = {}));
var sock_accept;
((sock_accept3) => {
  sock_accept3.name = "sock_accept";
  sock_accept3.signature = WasiFunctionSignature.create([Fd.$param, Fdflags.$param, Fd.$ptr]);
  const _transfers = ArgumentsTransfer.create([Fd.$transfer]);
  function transfers() {
    return _transfers;
  }
  sock_accept3.transfers = transfers;
  WasiFunctions.add(sock_accept3);
})(sock_accept || (sock_accept = {}));
var sock_shutdown;
((sock_shutdown3) => {
  sock_shutdown3.name = "sock_shutdown";
  sock_shutdown3.signature = WasiFunctionSignature.create([Fd.$param, Sdflags.$param]);
  WasiFunctions.add(sock_shutdown3);
})(sock_shutdown || (sock_shutdown = {}));
var thread_spawn;
((thread_spawn3) => {
  thread_spawn3.name = "thread-spawn";
  thread_spawn3.signature = WasiFunctionSignature.create([U32.$ptr]);
  const _transfers = ArgumentsTransfer.create([U32.$transfer]);
  function transfers() {
    return _transfers;
  }
  thread_spawn3.transfers = transfers;
  WasiFunctions.add(thread_spawn3);
})(thread_spawn || (thread_spawn = {}));
var thread_exit;
((thread_exit3) => {
  thread_exit3.name = "thread_exit";
  thread_exit3.signature = WasiFunctionSignature.create([U32.$param]);
  WasiFunctions.add(thread_exit3);
})(thread_exit || (thread_exit = {}));

// src/common/fileDescriptor.ts
var BaseFileDescriptor = class {
  constructor(deviceId, fd11, fileType, rights_base, rights_inheriting, fdflags11, inode6) {
    __publicField(this, "deviceId");
    __publicField(this, "fd");
    __publicField(this, "fileType");
    __publicField(this, "rights_base");
    __publicField(this, "rights_inheriting");
    __publicField(this, "fdflags");
    __publicField(this, "inode");
    this.deviceId = deviceId;
    this.fd = fd11;
    this.fileType = fileType;
    this.rights_base = rights_base;
    this.rights_inheriting = rights_inheriting;
    this.fdflags = fdflags11;
    this.inode = inode6;
  }
  containsBaseRights(rights12) {
    return (this.rights_base & rights12) === rights12;
  }
  assertRights(rights12) {
    if (((this.rights_base | this.rights_inheriting) & rights12) === rights12) {
      return;
    }
    throw new WasiError(Errno.perm);
  }
  assertBaseRights(rights12) {
    if ((this.rights_base & rights12) === rights12) {
      return;
    }
    throw new WasiError(Errno.perm);
  }
  assertInheritingRights(rights12) {
    if ((this.rights_inheriting & rights12) === rights12) {
      return;
    }
    throw new WasiError(Errno.perm);
  }
  assertFdflags(fdflags11) {
    if (!Rights.supportFdflags(this.rights_base, fdflags11)) {
      throw new WasiError(Errno.perm);
    }
  }
  assertOflags(oflags8) {
    if (!Rights.supportOflags(this.rights_base, oflags8)) {
      throw new WasiError(Errno.perm);
    }
  }
  assertIsDirectory() {
    if (this.fileType !== Filetype.directory) {
      throw new WasiError(Errno.notdir);
    }
  }
};
var FileDescriptors = class {
  constructor() {
    __publicField(this, "descriptors", /* @__PURE__ */ new Map());
    __publicField(this, "rootDescriptors", /* @__PURE__ */ new Map());
    __publicField(this, "mode", "init");
    __publicField(this, "counter", 0);
    __publicField(this, "firstReal", 3);
  }
  get firstRealFileDescriptor() {
    return this.firstReal;
  }
  next() {
    if (this.mode === "init") {
      throw new WasiError(Errno.inval);
    }
    return this.counter++;
  }
  switchToRunning(start) {
    if (this.mode === "running") {
      throw new WasiError(Errno.inval);
    }
    this.mode = "running";
    this.counter = start;
    this.firstReal = start;
  }
  add(descriptor) {
    this.descriptors.set(descriptor.fd, descriptor);
  }
  get(fd11) {
    const descriptor = this.descriptors.get(fd11);
    if (!descriptor) {
      throw new WasiError(Errno.badf);
    }
    return descriptor;
  }
  has(fd11) {
    return this.descriptors.has(fd11);
  }
  delete(descriptor) {
    return this.descriptors.delete(descriptor.fd);
  }
  setRoot(driver, descriptor) {
    this.rootDescriptors.set(driver.id, descriptor);
  }
  getRoot(driver) {
    return this.rootDescriptors.get(driver.id);
  }
  entries() {
    return this.descriptors.entries();
  }
  keys() {
    return this.descriptors.keys();
  }
  values() {
    return this.descriptors.values();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
};

// src/common/service.ts
var vscode = __toESM(require("vscode"));

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
((WorkerReadyMessage2) => {
  function is(message) {
    const candidate = message;
    return candidate && candidate.method === "workerReady";
  }
  WorkerReadyMessage2.is = is;
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
((TraceMessage2) => {
  function is(message) {
    const candidate = message;
    return candidate && candidate.method === "trace";
  }
  TraceMessage2.is = is;
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

// src/common/deviceDriver.ts
var FileSystemDeviceDriver;
((FileSystemDeviceDriver6) => {
  function is(value) {
    const candidate = value;
    return candidate.kind === "fileSystem" /* fileSystem */;
  }
  FileSystemDeviceDriver6.is = is;
})(FileSystemDeviceDriver || (FileSystemDeviceDriver = {}));
var NoSysDeviceDriver = {
  fd_advise() {
    throw new WasiError(Errno.nosys);
  },
  fd_allocate() {
    throw new WasiError(Errno.nosys);
  },
  fd_close() {
    throw new WasiError(Errno.nosys);
  },
  fd_datasync() {
    throw new WasiError(Errno.nosys);
  },
  fd_fdstat_get() {
    throw new WasiError(Errno.nosys);
  },
  fd_fdstat_set_flags() {
    throw new WasiError(Errno.nosys);
  },
  fd_filestat_get() {
    throw new WasiError(Errno.nosys);
  },
  fd_filestat_set_size() {
    throw new WasiError(Errno.nosys);
  },
  fd_filestat_set_times() {
    throw new WasiError(Errno.nosys);
  },
  fd_pread() {
    throw new WasiError(Errno.nosys);
  },
  fd_pwrite() {
    throw new WasiError(Errno.nosys);
  },
  fd_read() {
    throw new WasiError(Errno.nosys);
  },
  fd_readdir() {
    throw new WasiError(Errno.nosys);
  },
  fd_seek() {
    throw new WasiError(Errno.nosys);
  },
  fd_renumber() {
    throw new WasiError(Errno.nosys);
  },
  fd_sync() {
    throw new WasiError(Errno.nosys);
  },
  fd_tell() {
    throw new WasiError(Errno.nosys);
  },
  fd_write() {
    throw new WasiError(Errno.nosys);
  },
  path_create_directory() {
    throw new WasiError(Errno.nosys);
  },
  path_filestat_get() {
    throw new WasiError(Errno.nosys);
  },
  path_filestat_set_times() {
    throw new WasiError(Errno.nosys);
  },
  path_link() {
    throw new WasiError(Errno.nosys);
  },
  path_open() {
    throw new WasiError(Errno.nosys);
  },
  path_readlink() {
    throw new WasiError(Errno.nosys);
  },
  path_remove_directory() {
    throw new WasiError(Errno.nosys);
  },
  path_rename() {
    throw new WasiError(Errno.nosys);
  },
  path_symlink() {
    throw new WasiError(Errno.nosys);
  },
  path_unlink_file() {
    throw new WasiError(Errno.nosys);
  },
  fd_create_prestat_fd() {
    throw new WasiError(Errno.nosys);
  },
  fd_bytesAvailable() {
    throw new WasiError(Errno.nosys);
  }
};
var WritePermDeniedDeviceDriver = {
  fd_allocate() {
    throw new WasiError(Errno.perm);
  },
  fd_datasync() {
    throw new WasiError(Errno.perm);
  },
  fd_fdstat_set_flags() {
    throw new WasiError(Errno.perm);
  },
  fd_filestat_set_size() {
    throw new WasiError(Errno.perm);
  },
  fd_filestat_set_times() {
    throw new WasiError(Errno.perm);
  },
  fd_pwrite() {
    throw new WasiError(Errno.perm);
  },
  fd_renumber() {
    throw new WasiError(Errno.perm);
  },
  fd_sync() {
    throw new WasiError(Errno.perm);
  },
  fd_write() {
    throw new WasiError(Errno.perm);
  },
  path_create_directory() {
    throw new WasiError(Errno.perm);
  },
  path_filestat_set_times() {
    throw new WasiError(Errno.perm);
  },
  path_link() {
    throw new WasiError(Errno.perm);
  },
  path_remove_directory() {
    throw new WasiError(Errno.perm);
  },
  path_rename() {
    throw new WasiError(Errno.perm);
  },
  path_symlink() {
    throw new WasiError(Errno.perm);
  },
  path_unlink_file() {
    throw new WasiError(Errno.nosys);
  }
};

// src/common/converter.ts
var code = __toESM(require("vscode"));
var code2Wasi;
((code2Wasi2) => {
  function asFileType(fileType) {
    switch (fileType) {
      case code.FileType.File:
        return Filetype.regular_file;
      case code.FileType.Directory:
        return Filetype.directory;
      case code.FileType.SymbolicLink:
        return Filetype.symbolic_link;
      default:
        return Filetype.unknown;
    }
  }
  code2Wasi2.asFileType = asFileType;
  function asErrno(code2) {
    switch (code2) {
      case "FileNotFound":
        return Errno.noent;
      case "FileExists":
        return Errno.exist;
      case "FileNotADirectory":
        return Errno.notdir;
      case "FileIsADirectory":
        return Errno.isdir;
      case "NoPermissions":
        return Errno.perm;
      case "Unavailable":
        return Errno.busy;
      default:
        return Errno.inval;
    }
  }
  code2Wasi2.asErrno = asErrno;
})(code2Wasi || (code2Wasi = {}));
var BigInts;
((BigInts2) => {
  const MAX_VALUE_AS_BIGINT = BigInt(Number.MAX_VALUE);
  function asNumber(value) {
    if (value > MAX_VALUE_AS_BIGINT) {
      throw new WasiError(Errno.fbig);
    }
    return Number(value);
  }
  BigInts2.asNumber = asNumber;
  function max(...args) {
    return args.reduce((m, e) => e > m ? e : m);
  }
  BigInts2.max = max;
  function min(...args) {
    return args.reduce((m, e) => e < m ? e : m);
  }
  BigInts2.min = min;
})(BigInts || (BigInts = {}));

// src/common/promises.ts
var CapturedPromise;
((CapturedPromise2) => {
  function create8() {
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
  CapturedPromise2.create = create8;
})(CapturedPromise || (CapturedPromise = {}));

// src/common/service.ts
var ServiceConnection = class {
  constructor(wasiService, logChannel) {
    __publicField(this, "wasiService");
    __publicField(this, "logChannel");
    __publicField(this, "_workerReady");
    __publicField(this, "_workerDone");
    this.wasiService = wasiService;
    this.logChannel = logChannel;
    this._workerReady = CapturedPromise.create();
    this._workerDone = CapturedPromise.create();
  }
  workerReady() {
    return this._workerReady.promise;
  }
  workerDone() {
    return this._workerDone.promise;
  }
  async handleMessage(message) {
    if (WasiCallMessage.is(message)) {
      try {
        await this.handleWasiCallMessage(message);
      } catch (error) {
        ral_default().console.error(error);
      }
    } else if (WorkerReadyMessage.is(message)) {
      this._workerReady.resolve();
    } else if (WorkerDoneMessage.is(message)) {
      this._workerDone.resolve();
    } else if (this.logChannel !== void 0) {
      if (TraceMessage.is(message)) {
        const timeTaken = message.timeTaken;
        const final = `${message.message} (${timeTaken}ms)`;
        if (timeTaken > 10) {
          this.logChannel.error(final);
        } else if (timeTaken > 5) {
          this.logChannel.warn(final);
        } else {
          this.logChannel.info(final);
        }
      } else if (TraceSummaryMessage.is(message)) {
        if (message.summary.length === 0) {
          return;
        }
        this.logChannel.info(`Call summary:
	${message.summary.join("\n	")}`);
      }
    }
  }
  async handleWasiCallMessage(message) {
    const [paramBuffer, wasmMemory] = message;
    const paramView = new DataView(paramBuffer);
    try {
      const method = paramView.getUint32(Offsets.method_index, true);
      const func = WasiFunctions.functionAt(method);
      if (func === void 0) {
        throw new WasiError(Errno.inval);
      }
      const params = this.getParams(func.signature, paramBuffer);
      const result = await this.wasiService[func.name](wasmMemory, ...params);
      paramView.setUint16(Offsets.errno_index, result, true);
    } catch (err) {
      if (err instanceof WasiError) {
        paramView.setUint16(Offsets.errno_index, err.errno, true);
      } else {
        paramView.setUint16(Offsets.errno_index, Errno.inval, true);
      }
    }
    const sync = new Int32Array(paramBuffer, 0, 1);
    Atomics.store(sync, 0, 1);
    Atomics.notify(sync, 0);
  }
  getParams(signature, paramBuffer) {
    const paramView = new DataView(paramBuffer);
    const params = [];
    let offset = Offsets.header_size;
    for (let i = 0; i < signature.params.length; i++) {
      const param = signature.params[i];
      params.push(param.read(paramView, offset));
      offset += param.size;
    }
    return params;
  }
};
var EnvironmentWasiService;
((EnvironmentWasiService2) => {
  function create8(fileDescriptors, programName, preStats, options) {
    const $encoder = ral_default().TextEncoder.create(options?.encoding);
    const $preStatDirnames = /* @__PURE__ */ new Map();
    const result = {
      args_sizes_get: (memory, argvCount_ptr, argvBufSize_ptr) => {
        let count = 0;
        let size = 0;
        function processValue(str) {
          const value = `${str}\0`;
          size += $encoder.encode(value).byteLength;
          count++;
        }
        processValue(programName);
        for (const arg of options.args ?? []) {
          processValue(arg);
        }
        const view = new DataView(memory);
        view.setUint32(argvCount_ptr, count, true);
        view.setUint32(argvBufSize_ptr, size, true);
        return Promise.resolve(Errno.success);
      },
      args_get: (memory, argv_ptr, argvBuf_ptr) => {
        const memoryView = new DataView(memory);
        const memoryBytes = new Uint8Array(memory);
        let entryOffset = argv_ptr;
        let valueOffset = argvBuf_ptr;
        function processValue(str) {
          const data = $encoder.encode(`${str}\0`);
          memoryView.setUint32(entryOffset, valueOffset, true);
          entryOffset += 4;
          memoryBytes.set(data, valueOffset);
          valueOffset += data.byteLength;
        }
        processValue(programName);
        for (const arg of options.args ?? []) {
          processValue(arg);
        }
        return Promise.resolve(Errno.success);
      },
      environ_sizes_get: (memory, environCount_ptr, environBufSize_ptr) => {
        let count = 0;
        let size = 0;
        for (const entry of Object.entries(options.env ?? {})) {
          const value = `${entry[0]}=${entry[1]}\0`;
          size += $encoder.encode(value).byteLength;
          count++;
        }
        const view = new DataView(memory);
        view.setUint32(environCount_ptr, count, true);
        view.setUint32(environBufSize_ptr, size, true);
        return Promise.resolve(Errno.success);
      },
      environ_get: (memory, environ_ptr, environBuf_ptr) => {
        const view = new DataView(memory);
        const bytes = new Uint8Array(memory);
        let entryOffset = environ_ptr;
        let valueOffset = environBuf_ptr;
        for (const entry of Object.entries(options.env ?? {})) {
          const data = $encoder.encode(`${entry[0]}=${entry[1]}\0`);
          view.setUint32(entryOffset, valueOffset, true);
          entryOffset += 4;
          bytes.set(data, valueOffset);
          valueOffset += data.byteLength;
        }
        return Promise.resolve(Errno.success);
      },
      fd_prestat_get: async (memory, fd11, bufPtr) => {
        try {
          const next = preStats.next();
          if (next.done === true) {
            fileDescriptors.switchToRunning(fd11);
            return Errno.badf;
          }
          const [mountPoint, driver] = next.value;
          const fileDescriptor = await driver.fd_create_prestat_fd(fd11);
          fileDescriptors.add(fileDescriptor);
          fileDescriptors.setRoot(driver, fileDescriptor);
          $preStatDirnames.set(fileDescriptor.fd, mountPoint);
          const view = new DataView(memory);
          const prestat2 = Prestat.create(view, bufPtr);
          prestat2.preopentype = Preopentype.dir;
          prestat2.len = $encoder.encode(mountPoint).byteLength;
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_prestat_dir_name: (memory, fd11, pathPtr, pathLen) => {
        try {
          const fileDescriptor = fileDescriptors.get(fd11);
          const dirname = $preStatDirnames.get(fileDescriptor.fd);
          if (dirname === void 0) {
            return Promise.resolve(Errno.badf);
          }
          const bytes = $encoder.encode(dirname);
          if (bytes.byteLength !== pathLen) {
            Errno.badmsg;
          }
          const raw = new Uint8Array(memory, pathPtr);
          raw.set(bytes);
          return Promise.resolve(Errno.success);
        } catch (error) {
          return Promise.resolve(handleError(error));
        }
      }
    };
    function handleError(error, def = Errno.badf) {
      if (error instanceof WasiError) {
        return error.errno;
      } else if (error instanceof vscode.FileSystemError) {
        return code2Wasi.asErrno(error.code);
      }
      return def;
    }
    return result;
  }
  EnvironmentWasiService2.create = create8;
})(EnvironmentWasiService || (EnvironmentWasiService = {}));
var Clock;
((Clock2) => {
  function create8() {
    const thread_start = ral_default().clock.realtime();
    function now(id, _precision) {
      switch (id) {
        case Clockid.realtime:
          return ral_default().clock.realtime();
        case Clockid.monotonic:
          return ral_default().clock.monotonic();
        case Clockid.process_cputime_id:
        case Clockid.thread_cputime_id:
          return ral_default().clock.monotonic() - thread_start;
        default:
          throw new WasiError(Errno.inval);
      }
    }
    return {
      now
    };
  }
  Clock2.create = create8;
})(Clock || (Clock = {}));
var ClockWasiService;
((ClockWasiService2) => {
  function create8(clock) {
    const $clock = clock;
    const result = {
      clock_res_get: (memory, id, timestamp_ptr) => {
        const view = new DataView(memory);
        switch (id) {
          case Clockid.realtime:
          case Clockid.monotonic:
          case Clockid.process_cputime_id:
          case Clockid.thread_cputime_id:
            view.setBigUint64(timestamp_ptr, 1n, true);
            return Promise.resolve(Errno.success);
          default:
            view.setBigUint64(timestamp_ptr, 0n, true);
            return Promise.resolve(Errno.inval);
        }
      },
      clock_time_get: (memory, id, precision, timestamp_ptr) => {
        const time = $clock.now(id, precision);
        const view = new DataView(memory);
        view.setBigUint64(timestamp_ptr, time, true);
        return Promise.resolve(Errno.success);
      }
    };
    return result;
  }
  ClockWasiService2.create = create8;
})(ClockWasiService || (ClockWasiService = {}));
var DeviceWasiService;
((DeviceWasiService2) => {
  function create8(deviceDrivers, fileDescriptors, clock, virtualRootFileSystem, options) {
    const $directoryEntries = /* @__PURE__ */ new Map();
    const $clock = clock;
    const $encoder = ral_default().TextEncoder.create(options?.encoding);
    const $decoder = ral_default().TextDecoder.create(options?.encoding);
    const $path = ral_default().path;
    const result = {
      fd_advise: async (_memory, fd11, offset, length, advise3) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_advise);
          await getDeviceDriver(fileDescriptor).fd_advise(fileDescriptor, offset, length, advise3);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_allocate: async (_memory, fd11, offset, len) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_allocate);
          await getDeviceDriver(fileDescriptor).fd_allocate(fileDescriptor, offset, len);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_close: async (_memory, fd11) => {
        const fileDescriptor = getFileDescriptor(fd11);
        try {
          await getDeviceDriver(fileDescriptor).fd_close(fileDescriptor);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        } finally {
          fileDescriptors.delete(fileDescriptor);
          if (fileDescriptor.dispose !== void 0) {
            await fileDescriptor.dispose();
          }
        }
      },
      fd_datasync: async (_memory, fd11) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_datasync);
          await getDeviceDriver(fileDescriptor).fd_datasync(fileDescriptor);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_fdstat_get: async (memory, fd11, fdstat_ptr) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          await getDeviceDriver(fileDescriptor).fd_fdstat_get(fileDescriptor, Fdstat.create(new DataView(memory), fdstat_ptr));
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_fdstat_set_flags: async (_memory, fd11, fdflags11) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_fdstat_set_flags);
          await getDeviceDriver(fileDescriptor).fd_fdstat_set_flags(fileDescriptor, fdflags11);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_filestat_get: async (memory, fd11, filestat_ptr) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_filestat_get);
          await getDeviceDriver(fileDescriptor).fd_filestat_get(fileDescriptor, Filestat.create(new DataView(memory), filestat_ptr));
          return Errno.success;
        } catch (error) {
          return handleError(error, Errno.perm);
        }
      },
      fd_filestat_set_size: async (_memory, fd11, size) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_filestat_set_size);
          await getDeviceDriver(fileDescriptor).fd_filestat_set_size(fileDescriptor, size);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_filestat_set_times: async (_memory, fd11, atim, mtim, fst_flags) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_filestat_set_times);
          await getDeviceDriver(fileDescriptor).fd_filestat_set_times(fileDescriptor, atim, mtim, fst_flags);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_pread: async (memory, fd11, iovs_ptr, iovs_len, offset, bytesRead_ptr) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_read | Rights.fd_seek);
          const view = new DataView(memory);
          const buffers = read_iovs(memory, iovs_ptr, iovs_len);
          const bytesRead = await getDeviceDriver(fileDescriptor).fd_pread(fileDescriptor, offset, buffers);
          view.setUint32(bytesRead_ptr, bytesRead, true);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_pwrite: async (memory, fd11, ciovs_ptr, ciovs_len, offset, bytesWritten_ptr) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_write | Rights.fd_seek);
          const view = new DataView(memory);
          const buffers = read_ciovs(memory, ciovs_ptr, ciovs_len);
          const bytesWritten = await getDeviceDriver(fileDescriptor).fd_pwrite(fileDescriptor, offset, buffers);
          view.setUint32(bytesWritten_ptr, bytesWritten, true);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_read: async (memory, fd11, iovs_ptr, iovs_len, bytesRead_ptr) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_read);
          const view = new DataView(memory);
          const buffers = read_iovs(memory, iovs_ptr, iovs_len);
          const bytesRead = await getDeviceDriver(fileDescriptor).fd_read(fileDescriptor, buffers);
          view.setUint32(bytesRead_ptr, bytesRead, true);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_readdir: async (memory, fd11, buf_ptr, buf_len, cookie, buf_used_ptr) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_readdir);
          fileDescriptor.assertIsDirectory();
          const driver = getDeviceDriver(fileDescriptor);
          const view = new DataView(memory);
          if (cookie !== 0n && !$directoryEntries.has(fileDescriptor.fd)) {
            view.setUint32(buf_used_ptr, 0, true);
            return Errno.success;
          }
          if (cookie === 0n) {
            $directoryEntries.set(fileDescriptor.fd, await driver.fd_readdir(fileDescriptor));
          }
          const entries = $directoryEntries.get(fileDescriptor.fd);
          if (entries === void 0) {
            throw new WasiError(Errno.badmsg);
          }
          let i = Number(cookie);
          let ptr = buf_ptr;
          let spaceLeft = buf_len;
          for (; i < entries.length && spaceLeft >= Dirent.size; i++) {
            const entry = entries[i];
            const name = entry.d_name;
            const nameBytes = $encoder.encode(name);
            const dirent2 = Dirent.create(view, ptr);
            dirent2.d_next = BigInt(i + 1);
            dirent2.d_ino = entry.d_ino;
            dirent2.d_type = entry.d_type;
            dirent2.d_namlen = nameBytes.byteLength;
            spaceLeft -= Dirent.size;
            const spaceForName = Math.min(spaceLeft, nameBytes.byteLength);
            new Uint8Array(memory, ptr + Dirent.size, spaceForName).set(nameBytes.subarray(0, spaceForName));
            ptr += Dirent.size + spaceForName;
            spaceLeft -= spaceForName;
          }
          if (i === entries.length) {
            view.setUint32(buf_used_ptr, ptr - buf_ptr, true);
            $directoryEntries.delete(fileDescriptor.fd);
          } else {
            view.setUint32(buf_used_ptr, buf_len, true);
          }
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_seek: async (memory, fd11, offset, whence3, new_offset_ptr) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          if (whence3 === Whence.cur && offset === 0n && !fileDescriptor.containsBaseRights(Rights.fd_seek) && !fileDescriptor.containsBaseRights(Rights.fd_tell)) {
            throw new WasiError(Errno.perm);
          } else {
            fileDescriptor.assertBaseRights(Rights.fd_seek);
          }
          const view = new DataView(memory);
          const newOffset = await getDeviceDriver(fileDescriptor).fd_seek(fileDescriptor, offset, whence3);
          view.setBigUint64(new_offset_ptr, BigInt(newOffset), true);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_renumber: (_memory, fd11, to) => {
        try {
          if (fd11 < fileDescriptors.firstRealFileDescriptor || to < fileDescriptors.firstRealFileDescriptor) {
            return Promise.resolve(Errno.notsup);
          }
          if (fileDescriptors.has(to)) {
            return Promise.resolve(Errno.badf);
          }
          const fileDescriptor = getFileDescriptor(fd11);
          const toFileDescriptor = fileDescriptor.with({ fd: to });
          fileDescriptors.delete(fileDescriptor);
          fileDescriptors.add(toFileDescriptor);
          return Promise.resolve(Errno.success);
        } catch (error) {
          return Promise.resolve(handleError(error));
        }
      },
      fd_sync: async (_memory, fd11) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_sync);
          await getDeviceDriver(fileDescriptor).fd_sync(fileDescriptor);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_tell: async (memory, fd11, offset_ptr) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_tell | Rights.fd_seek);
          const view = new DataView(memory);
          const offset = await getDeviceDriver(fileDescriptor).fd_tell(fileDescriptor);
          view.setBigUint64(offset_ptr, BigInt(offset), true);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      fd_write: async (memory, fd11, ciovs_ptr, ciovs_len, bytesWritten_ptr) => {
        try {
          const fileDescriptor = getFileDescriptor(fd11);
          fileDescriptor.assertBaseRights(Rights.fd_write);
          const view = new DataView(memory);
          const buffers = read_ciovs(memory, ciovs_ptr, ciovs_len);
          const bytesWritten = await getDeviceDriver(fileDescriptor).fd_write(fileDescriptor, buffers);
          view.setUint32(bytesWritten_ptr, bytesWritten, true);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      path_create_directory: async (memory, fd11, path_ptr, path_len) => {
        try {
          const parentFileDescriptor = getFileDescriptor(fd11);
          parentFileDescriptor.assertBaseRights(Rights.path_create_directory);
          parentFileDescriptor.assertIsDirectory();
          const [deviceDriver, fileDescriptor, path2] = getDeviceDriverWithPath(parentFileDescriptor, $decoder.decode(new Uint8Array(memory, path_ptr, path_len)));
          if (fileDescriptor !== parentFileDescriptor) {
            fileDescriptor.assertBaseRights(Rights.path_create_directory);
            fileDescriptor.assertIsDirectory();
          }
          await deviceDriver.path_create_directory(fileDescriptor, path2);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      path_filestat_get: async (memory, fd11, flags, path_ptr, path_len, filestat_ptr) => {
        try {
          const parentFileDescriptor = getFileDescriptor(fd11);
          parentFileDescriptor.assertBaseRights(Rights.path_filestat_get);
          parentFileDescriptor.assertIsDirectory();
          const [deviceDriver, fileDescriptor, path2] = getDeviceDriverWithPath(parentFileDescriptor, $decoder.decode(new Uint8Array(memory, path_ptr, path_len)));
          if (fileDescriptor !== parentFileDescriptor) {
            fileDescriptor.assertBaseRights(Rights.path_filestat_get);
            fileDescriptor.assertIsDirectory();
          }
          await deviceDriver.path_filestat_get(fileDescriptor, flags, path2, Filestat.create(new DataView(memory), filestat_ptr));
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      path_filestat_set_times: async (memory, fd11, flags, path_ptr, path_len, atim, mtim, fst_flags) => {
        try {
          const parentFileDescriptor = getFileDescriptor(fd11);
          parentFileDescriptor.assertBaseRights(Rights.path_filestat_set_times);
          parentFileDescriptor.assertIsDirectory();
          const [deviceDriver, fileDescriptor, path2] = getDeviceDriverWithPath(parentFileDescriptor, $decoder.decode(new Uint8Array(memory, path_ptr, path_len)));
          if (fileDescriptor !== parentFileDescriptor) {
            fileDescriptor.assertBaseRights(Rights.path_filestat_get);
            fileDescriptor.assertIsDirectory();
          }
          await deviceDriver.path_filestat_set_times(fileDescriptor, flags, path2, atim, mtim, fst_flags);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      path_link: async (memory, old_fd, old_flags, old_path_ptr, old_path_len, new_fd, new_path_ptr, new_path_len) => {
        try {
          const oldParentFileDescriptor = getFileDescriptor(old_fd);
          oldParentFileDescriptor.assertBaseRights(Rights.path_link_source);
          oldParentFileDescriptor.assertIsDirectory();
          const newParentFileDescriptor = getFileDescriptor(new_fd);
          newParentFileDescriptor.assertBaseRights(Rights.path_link_target);
          newParentFileDescriptor.assertIsDirectory();
          if (oldParentFileDescriptor.deviceId !== newParentFileDescriptor.deviceId) {
            return Errno.nosys;
          }
          const [oldDeviceDriver, oldFileDescriptor, oldPath] = getDeviceDriverWithPath(oldParentFileDescriptor, $decoder.decode(new Uint8Array(memory, old_path_ptr, old_path_len)));
          const [newDeviceDriver, newFileDescriptor, newPath] = getDeviceDriverWithPath(newParentFileDescriptor, $decoder.decode(new Uint8Array(memory, new_path_ptr, new_path_len)));
          if (oldDeviceDriver !== newDeviceDriver || oldFileDescriptor.deviceId !== newFileDescriptor.deviceId) {
            return Errno.nosys;
          }
          if (oldFileDescriptor !== oldParentFileDescriptor) {
            oldFileDescriptor.assertBaseRights(Rights.path_link_source);
            oldFileDescriptor.assertIsDirectory();
          }
          if (newFileDescriptor !== newParentFileDescriptor) {
            newFileDescriptor.assertBaseRights(Rights.path_link_target);
            newFileDescriptor.assertIsDirectory();
          }
          await oldDeviceDriver.path_link(oldFileDescriptor, old_flags, oldPath, newFileDescriptor, newPath);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      path_open: async (memory, fd11, dirflags, path_ptr, path_len, oflags8, fs_rights_base, fs_rights_inheriting, fdflags11, fd_ptr) => {
        try {
          const parentFileDescriptor = getFileDescriptor(fd11);
          parentFileDescriptor.assertBaseRights(Rights.path_open);
          parentFileDescriptor.assertFdflags(fdflags11);
          parentFileDescriptor.assertOflags(oflags8);
          const [deviceDriver, fileDescriptor, path2] = getDeviceDriverWithPath(parentFileDescriptor, $decoder.decode(new Uint8Array(memory, path_ptr, path_len)));
          if (fileDescriptor !== parentFileDescriptor) {
            fileDescriptor.assertBaseRights(Rights.path_open);
            fileDescriptor.assertFdflags(fdflags11);
            fileDescriptor.assertOflags(oflags8);
          }
          const result2 = await deviceDriver.path_open(fileDescriptor, dirflags, path2, oflags8, fs_rights_base, fs_rights_inheriting, fdflags11, fileDescriptors);
          fileDescriptors.add(result2);
          const view = new DataView(memory);
          view.setUint32(fd_ptr, result2.fd, true);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      path_readlink: async (memory, fd11, path_ptr, path_len, buf_ptr, buf_len, result_size_ptr) => {
        try {
          const parentFileDescriptor = getFileDescriptor(fd11);
          parentFileDescriptor.assertBaseRights(Rights.path_readlink);
          parentFileDescriptor.assertIsDirectory();
          const [deviceDriver, fileDescriptor, path2] = getDeviceDriverWithPath(parentFileDescriptor, $decoder.decode(new Uint8Array(memory, path_ptr, path_len)));
          if (fileDescriptor !== parentFileDescriptor) {
            fileDescriptor.assertBaseRights(Rights.path_readlink);
            fileDescriptor.assertIsDirectory();
          }
          const target = $encoder.encode(await deviceDriver.path_readlink(fileDescriptor, path2));
          if (target.byteLength > buf_len) {
            return Errno.inval;
          }
          new Uint8Array(memory, buf_ptr, buf_len).set(target);
          new DataView(memory).setUint32(result_size_ptr, target.byteLength, true);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      path_remove_directory: async (memory, fd11, path_ptr, path_len) => {
        try {
          const parentFileDescriptor = getFileDescriptor(fd11);
          parentFileDescriptor.assertBaseRights(Rights.path_remove_directory);
          parentFileDescriptor.assertIsDirectory();
          const [deviceDriver, fileDescriptor, path2] = getDeviceDriverWithPath(parentFileDescriptor, $decoder.decode(new Uint8Array(memory, path_ptr, path_len)));
          if (fileDescriptor !== parentFileDescriptor) {
            fileDescriptor.assertBaseRights(Rights.path_remove_directory);
            fileDescriptor.assertIsDirectory();
          }
          await deviceDriver.path_remove_directory(fileDescriptor, path2);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      path_rename: async (memory, old_fd, old_path_ptr, old_path_len, new_fd, new_path_ptr, new_path_len) => {
        try {
          const oldParentFileDescriptor = getFileDescriptor(old_fd);
          oldParentFileDescriptor.assertBaseRights(Rights.path_rename_source);
          oldParentFileDescriptor.assertIsDirectory();
          const newParentFileDescriptor = getFileDescriptor(new_fd);
          newParentFileDescriptor.assertBaseRights(Rights.path_rename_target);
          newParentFileDescriptor.assertIsDirectory();
          const [oldDeviceDriver, oldFileDescriptor, oldPath] = getDeviceDriverWithPath(oldParentFileDescriptor, $decoder.decode(new Uint8Array(memory, old_path_ptr, old_path_len)));
          const [newDeviceDriver, newFileDescriptor, newPath] = getDeviceDriverWithPath(newParentFileDescriptor, $decoder.decode(new Uint8Array(memory, new_path_ptr, new_path_len)));
          if (oldDeviceDriver !== newDeviceDriver) {
            return Errno.nosys;
          }
          if (oldFileDescriptor !== oldParentFileDescriptor) {
            oldFileDescriptor.assertBaseRights(Rights.path_rename_source);
            oldFileDescriptor.assertIsDirectory();
          }
          if (newFileDescriptor !== newParentFileDescriptor) {
            newFileDescriptor.assertBaseRights(Rights.path_rename_target);
            newFileDescriptor.assertIsDirectory();
          }
          await oldDeviceDriver.path_rename(oldFileDescriptor, oldPath, newFileDescriptor, newPath);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      path_symlink: async (memory, old_path_ptr, old_path_len, fd11, new_path_ptr, new_path_len) => {
        try {
          const parentFileDescriptor = getFileDescriptor(fd11);
          parentFileDescriptor.assertBaseRights(Rights.path_symlink);
          parentFileDescriptor.assertIsDirectory();
          const [oldDeviceDriver, oldFileDescriptor, oldPath] = getDeviceDriverWithPath(parentFileDescriptor, $decoder.decode(new Uint8Array(memory, old_path_ptr, old_path_len)));
          const [newDeviceDriver, newFileDescriptor, newPath] = getDeviceDriverWithPath(parentFileDescriptor, $decoder.decode(new Uint8Array(memory, new_path_ptr, new_path_len)));
          if (oldDeviceDriver !== newDeviceDriver || oldFileDescriptor !== newFileDescriptor) {
            return Errno.nosys;
          }
          if (oldFileDescriptor !== parentFileDescriptor) {
            oldFileDescriptor.assertBaseRights(Rights.path_symlink);
            oldFileDescriptor.assertIsDirectory();
          }
          await oldDeviceDriver.path_symlink(oldPath, oldFileDescriptor, newPath);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      path_unlink_file: async (memory, fd11, path_ptr, path_len) => {
        try {
          const parentFileDescriptor = getFileDescriptor(fd11);
          parentFileDescriptor.assertBaseRights(Rights.path_unlink_file);
          parentFileDescriptor.assertIsDirectory();
          const [deviceDriver, fileDescriptor, path2] = getDeviceDriverWithPath(parentFileDescriptor, $decoder.decode(new Uint8Array(memory, path_ptr, path_len)));
          if (fileDescriptor !== parentFileDescriptor) {
            fileDescriptor.assertBaseRights(Rights.path_unlink_file);
            fileDescriptor.assertIsDirectory();
          }
          await deviceDriver.path_unlink_file(fileDescriptor, path2);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      poll_oneoff: async (memory, input, output, subscriptions, result_size_ptr) => {
        try {
          const view = new DataView(memory);
          let { events, timeout } = await handleSubscriptions(view, input, subscriptions);
          if (timeout !== void 0 && timeout !== 0n) {
            await new Promise((resolve) => {
              ral_default().timer.setTimeout(resolve, BigInts.asNumber(timeout / 1000000n));
            });
            events = (await handleSubscriptions(view, input, subscriptions)).events;
          }
          let event_offset = output;
          for (const item of events) {
            const event2 = Event.create(view, event_offset);
            event2.userdata = item.userdata;
            event2.type = item.type;
            event2.error = item.error;
            event2.fd_readwrite.nbytes = item.fd_readwrite.nbytes;
            event2.fd_readwrite.flags = item.fd_readwrite.flags;
            event_offset += Event.size;
          }
          view.setUint32(result_size_ptr, events.length, true);
          return Errno.success;
        } catch (error) {
          return handleError(error);
        }
      },
      proc_exit: async (_memory, _rval) => {
        return Promise.resolve(Errno.success);
      },
      sched_yield: () => {
        return Promise.resolve(Errno.success);
      },
      random_get: (memory, buf, buf_len) => {
        const random = ral_default().crypto.randomGet(buf_len);
        new Uint8Array(memory, buf, buf_len).set(random);
        return Promise.resolve(Errno.success);
      },
      sock_accept: (_memory, _fd, _flags, _result_fd_ptr) => {
        return Promise.resolve(Errno.nosys);
      },
      sock_recv: (_memory, _fd, _ri_data_ptr, _ri_data_len, _ri_flags, _ro_datalen_ptr, _roflags_ptr) => {
        return Promise.resolve(Errno.nosys);
      },
      sock_send: (_memory, _fd, _si_data_ptr, _si_data_len, _si_flags, _si_datalen_ptr) => {
        return Promise.resolve(Errno.nosys);
      },
      sock_shutdown: (_memory, _fd, _sdflags) => {
        return Promise.resolve(Errno.nosys);
      },
      thread_exit: async (_memory, _tid) => {
        return Promise.resolve(Errno.success);
      },
      "thread-spawn": async (_memory, _start_args_ptr) => {
        return Promise.resolve(Errno.nosys);
      }
    };
    async function handleSubscriptions(memory, input, subscriptions) {
      let subscription_offset = input;
      const events = [];
      let timeout;
      for (let i = 0; i < subscriptions; i++) {
        const subscription2 = Subscription.create(memory, subscription_offset);
        const u = subscription2.u;
        switch (u.type) {
          case Eventtype.clock:
            const clockResult = handleClockSubscription(subscription2);
            timeout = clockResult.timeout;
            events.push(clockResult.event);
            break;
          case Eventtype.fd_read:
            const readEvent = await handleReadSubscription(subscription2);
            events.push(readEvent);
            break;
          case Eventtype.fd_write:
            const writeEvent = handleWriteSubscription(subscription2);
            events.push(writeEvent);
            break;
        }
        subscription_offset += Subscription.size;
      }
      return { events, timeout };
    }
    function handleClockSubscription(subscription2) {
      const result2 = {
        userdata: subscription2.userdata,
        type: Eventtype.clock,
        error: Errno.success,
        fd_readwrite: {
          nbytes: 0n,
          flags: 0
        }
      };
      const clock2 = subscription2.u.clock;
      let timeout;
      if ((clock2.flags & Subclockflags.subscription_clock_abstime) !== 0) {
        const time = $clock.now(Clockid.realtime, 0n);
        timeout = BigInt(Math.max(0, BigInts.asNumber(time - clock2.timeout)));
      } else {
        timeout = clock2.timeout;
      }
      return { event: result2, timeout };
    }
    async function handleReadSubscription(subscription2) {
      const fd11 = subscription2.u.fd_read.file_descriptor;
      try {
        const fileDescriptor = getFileDescriptor(fd11);
        if (!fileDescriptor.containsBaseRights(Rights.poll_fd_readwrite) && !fileDescriptor.containsBaseRights(Rights.fd_read)) {
          throw new WasiError(Errno.perm);
        }
        const available = await getDeviceDriver(fileDescriptor).fd_bytesAvailable(fileDescriptor);
        return {
          userdata: subscription2.userdata,
          type: Eventtype.fd_read,
          error: Errno.success,
          fd_readwrite: {
            nbytes: available,
            flags: 0
          }
        };
      } catch (error) {
        return {
          userdata: subscription2.userdata,
          type: Eventtype.fd_read,
          error: handleError(error),
          fd_readwrite: {
            nbytes: 0n,
            flags: 0
          }
        };
      }
    }
    function handleWriteSubscription(subscription2) {
      const fd11 = subscription2.u.fd_write.file_descriptor;
      try {
        const fileDescriptor = getFileDescriptor(fd11);
        if (!fileDescriptor.containsBaseRights(Rights.poll_fd_readwrite) && !fileDescriptor.containsBaseRights(Rights.fd_write)) {
          throw new WasiError(Errno.perm);
        }
        return {
          userdata: subscription2.userdata,
          type: Eventtype.fd_write,
          error: Errno.success,
          fd_readwrite: {
            nbytes: 0n,
            flags: 0
          }
        };
      } catch (error) {
        return {
          userdata: subscription2.userdata,
          type: Eventtype.fd_write,
          error: handleError(error),
          fd_readwrite: {
            nbytes: 0n,
            flags: 0
          }
        };
      }
    }
    function handleError(error, def = Errno.badf) {
      if (error instanceof WasiError) {
        return error.errno;
      } else if (error instanceof vscode.FileSystemError) {
        return code2Wasi.asErrno(error.code);
      }
      return def;
    }
    function read_ciovs(memory, iovs, iovsLen) {
      const view = new DataView(memory);
      const buffers = [];
      let ptr = iovs;
      for (let i = 0; i < iovsLen; i++) {
        const vec = Ciovec.create(view, ptr);
        const copy = new Uint8Array(vec.buf_len);
        copy.set(new Uint8Array(memory, vec.buf, vec.buf_len));
        buffers.push(copy);
        ptr += Ciovec.size;
      }
      return buffers;
    }
    function read_iovs(memory, iovs, iovsLen) {
      const view = new DataView(memory);
      const buffers = [];
      let ptr = iovs;
      for (let i = 0; i < iovsLen; i++) {
        const vec = Iovec.create(view, ptr);
        buffers.push(new Uint8Array(memory, vec.buf, vec.buf_len));
        ptr += Iovec.size;
      }
      return buffers;
    }
    function getDeviceDriver(fileDescriptor) {
      return deviceDrivers.get(fileDescriptor.deviceId);
    }
    function getDeviceDriverWithPath(fileDescriptor, path2) {
      const result2 = deviceDrivers.get(fileDescriptor.deviceId);
      if (!$path.isAbsolute(path2) && virtualRootFileSystem !== void 0 && virtualRootFileSystem !== result2 && FileSystemDeviceDriver.is(result2)) {
        path2 = $path.normalize(path2);
        if (path2.startsWith("..")) {
          const virtualPath = virtualRootFileSystem.makeVirtualPath(result2, path2);
          if (virtualPath === void 0) {
            throw new WasiError(Errno.noent);
          }
          const rootDescriptor = fileDescriptors.getRoot(virtualRootFileSystem);
          if (rootDescriptor === void 0) {
            throw new WasiError(Errno.noent);
          }
          return [virtualRootFileSystem, rootDescriptor, virtualPath];
        }
      }
      return [result2, fileDescriptor, path2];
    }
    function getFileDescriptor(fd11) {
      const result2 = fileDescriptors.get(fd11);
      if (result2 === void 0) {
        throw new WasiError(Errno.badf);
      }
      return result2;
    }
    return result;
  }
  DeviceWasiService2.create = create8;
})(DeviceWasiService || (DeviceWasiService = {}));
var FileSystemService;
((FileSystemService2) => {
  function create8(deviceDrivers, fileDescriptors, virtualRootFileSystem, preOpens, options) {
    const clock = Clock.create();
    return Object.assign(
      {},
      EnvironmentWasiService.create(fileDescriptors, "virtualRootFileSystem", preOpens.entries(), {}),
      DeviceWasiService.create(deviceDrivers, fileDescriptors, clock, virtualRootFileSystem, options)
    );
  }
  FileSystemService2.create = create8;
})(FileSystemService || (FileSystemService = {}));

// src/common/fileSystem.ts
var Filetypes;
((Filetypes2) => {
  function from(filetype5) {
    switch (filetype5) {
      case Filetype.directory:
        return 1 /* directory */;
      case Filetype.regular_file:
        return 2 /* regular_file */;
      case Filetype.character_device:
        return 3 /* character_device */;
      default:
        return 0 /* unknown */;
    }
  }
  Filetypes2.from = from;
  function to(filetype5) {
    switch (filetype5) {
      case 2 /* regular_file */:
        return Filetype.regular_file;
      case 1 /* directory */:
        return Filetype.directory;
      case 3 /* character_device */:
        return Filetype.character_device;
      default:
        return Filetype.unknown;
    }
  }
  Filetypes2.to = to;
})(Filetypes || (Filetypes = {}));
var BaseFileSystem = class {
  constructor(root) {
    __publicField(this, "inodeCounter");
    __publicField(this, "root");
    this.inodeCounter = 2n;
    this.root = root;
  }
  nextInode() {
    return this.inodeCounter++;
  }
  getRoot() {
    return this.root;
  }
  findNode(parentOrPath, p) {
    let parent;
    let path2;
    if (typeof parentOrPath === "string") {
      parent = this.root;
      path2 = parentOrPath;
    } else {
      parent = parentOrPath;
      path2 = p;
    }
    const parts = this.getSegmentsFromPath(path2);
    if (parts.length === 1) {
      if (parts[0] === ".") {
        return parent;
      } else if (parts[0] === "..") {
        return parent.parent;
      }
    }
    let current = parent;
    for (let i = 0; i < parts.length; i++) {
      switch (current.filetype) {
        case Filetype.regular_file:
          return void 0;
        case Filetype.directory:
          current = current.entries.get(parts[i]);
          if (current === void 0) {
            return void 0;
          }
          break;
      }
    }
    return current;
  }
  getSegmentsFromPath(path2) {
    if (path2.charAt(0) === "/") {
      path2 = path2.substring(1);
    }
    if (path2.charAt(path2.length - 1) === "/") {
      path2 = path2.substring(0, path2.length - 1);
    }
    return path2.normalize().split("/");
  }
};
var NodeDescriptor = class extends BaseFileDescriptor {
  constructor(deviceId, fd11, filetype5, rights_base, rights_inheriting, fdflags11, inode6, node) {
    super(deviceId, fd11, filetype5, rights_base, rights_inheriting, fdflags11, inode6);
    __publicField(this, "node");
    this.node = node;
    this.node.refs++;
  }
  dispose() {
    this.node.refs--;
    return Promise.resolve();
  }
};
var FileNodeDescriptor = class _FileNodeDescriptor extends NodeDescriptor {
  constructor(deviceId, fd11, rights_base, fdflags11, inode6, node) {
    super(deviceId, fd11, Filetype.regular_file, rights_base, 0n, fdflags11, inode6, node);
    __publicField(this, "_cursor");
    this._cursor = 0n;
  }
  with(change) {
    return new _FileNodeDescriptor(this.deviceId, change.fd, this.rights_base, this.fdflags, this.inode, this.node);
  }
  get cursor() {
    return this._cursor;
  }
  set cursor(value) {
    if (value < 0) {
      throw new WasiError(Errno.inval);
    }
    this._cursor = value;
  }
};
var CharacterDeviceNodeDescriptor = class _CharacterDeviceNodeDescriptor extends NodeDescriptor {
  constructor(deviceId, fd11, rights_base, fdflags11, inode6, node) {
    super(deviceId, fd11, Filetype.regular_file, rights_base, 0n, fdflags11, inode6, node);
  }
  with(change) {
    return new _CharacterDeviceNodeDescriptor(this.deviceId, change.fd, this.rights_base, this.fdflags, this.inode, this.node);
  }
};
var DirectoryNodeDescriptor = class _DirectoryNodeDescriptor extends NodeDescriptor {
  constructor(deviceId, fd11, rights_base, rights_inheriting, fdflags11, inode6, node) {
    super(deviceId, fd11, Filetype.directory, rights_base, rights_inheriting, fdflags11, inode6, node);
  }
  with(change) {
    return new _DirectoryNodeDescriptor(this.deviceId, change.fd, this.rights_base, this.rights_inheriting, this.fdflags, this.inode, this.node);
  }
  childDirectoryRights(requested_rights, fileOnlyBaseRights) {
    return this.rights_inheriting & requested_rights & ~fileOnlyBaseRights;
  }
  childFileRights(requested_rights, directoryOnlyBaseRights) {
    return this.rights_inheriting & requested_rights & ~directoryOnlyBaseRights;
  }
};
var WasmRootFileSystemImpl = class {
  constructor(info, fileDescriptors) {
    __publicField(this, "deviceDrivers");
    __publicField(this, "preOpens");
    __publicField(this, "fileDescriptors");
    __publicField(this, "service");
    __publicField(this, "virtualFileSystem");
    __publicField(this, "singleFileSystem");
    this.deviceDrivers = info.deviceDrivers;
    this.preOpens = info.preOpens;
    this.fileDescriptors = fileDescriptors;
    if (info.kind === "virtual") {
      this.service = FileSystemService.create(info.deviceDrivers, fileDescriptors, info.fileSystem, info.preOpens, {});
      this.virtualFileSystem = info.fileSystem;
    } else {
      this.service = FileSystemService.create(info.deviceDrivers, fileDescriptors, void 0, info.preOpens, {});
      this.singleFileSystem = info.fileSystem;
    }
  }
  async initialize() {
    let fd11 = 3;
    let errno3;
    const memory = new ArrayBuffer(1024);
    do {
      errno3 = await this.service.fd_prestat_get(memory, fd11++, 0);
    } while (errno3 === Errno.success);
  }
  getDeviceDrivers() {
    return Array.from(this.deviceDrivers.values());
  }
  getPreOpenDirectories() {
    return this.preOpens;
  }
  getVirtualRootFileSystem() {
    return this.virtualFileSystem;
  }
  async toVSCode(path2) {
    try {
      const [deviceDriver, relativePath] = this.getDeviceDriver(path2);
      if (deviceDriver === void 0) {
        return void 0;
      }
      return deviceDriver.joinPath(...relativePath.split("/"));
    } catch (error) {
      if (error instanceof WasiError && error.errno === Errno.noent) {
        return void 0;
      }
      throw error;
    }
  }
  async toWasm(uri2) {
    try {
      const [mountPoint, root] = this.getMountPoint(uri2);
      if (mountPoint === void 0) {
        return void 0;
      }
      const relative = uri2.toString().substring(root.toString().length + 1);
      return ral_default().path.join(mountPoint, relative);
    } catch (error) {
      if (error instanceof WasiError && error.errno === Errno.noent) {
        return void 0;
      }
      throw error;
    }
  }
  async stat(path2) {
    const [fileDescriptor, relativePath] = this.getFileDescriptor(path2);
    if (fileDescriptor !== void 0) {
      const deviceDriver = this.deviceDrivers.get(fileDescriptor.deviceId);
      if (deviceDriver !== void 0 && deviceDriver.kind === "fileSystem") {
        const result = Filestat.createHeap();
        await deviceDriver.path_filestat_get(fileDescriptor, Lookupflags.none, relativePath, result);
        return { filetype: Filetypes.from(result.filetype) };
      }
    }
    throw new WasiError(Errno.noent);
  }
  getFileDescriptor(path2) {
    if (this.virtualFileSystem !== void 0) {
      const [deviceDriver, rest] = this.virtualFileSystem.getDeviceDriver(path2);
      if (deviceDriver !== void 0) {
        return [this.fileDescriptors.getRoot(deviceDriver), rest];
      } else {
        return [this.fileDescriptors.getRoot(this.virtualFileSystem), path2];
      }
    } else if (this.singleFileSystem !== void 0) {
      return [this.fileDescriptors.getRoot(this.singleFileSystem), path2];
    } else {
      return [void 0, path2];
    }
  }
  getDeviceDriver(path2) {
    if (this.virtualFileSystem !== void 0) {
      return this.virtualFileSystem.getDeviceDriver(path2);
    } else if (this.singleFileSystem !== void 0) {
      return [this.singleFileSystem, path2];
    } else {
      return [void 0, path2];
    }
  }
  getMountPoint(uri2) {
    if (this.virtualFileSystem !== void 0) {
      return this.virtualFileSystem.getMountPoint(uri2);
    } else if (this.singleFileSystem !== void 0) {
      const uriStr = uri2.toString();
      const rootStr = this.singleFileSystem.uri.toString();
      if (uriStr === rootStr || uriStr.startsWith(rootStr) && uriStr.charAt(rootStr.length) === "/") {
        return ["/", this.singleFileSystem.uri];
      }
    }
    return [void 0, uri2];
  }
};

// src/common/kernel.ts
var import_vscode7 = require("vscode");

// src/common/consoleDriver.ts
var import_vscode = require("vscode");
var ConsoleBaseRights = Rights.fd_read | Rights.fd_fdstat_set_flags | Rights.fd_write | Rights.fd_filestat_get | Rights.poll_fd_readwrite;
var ConsoleInheritingRights = 0n;
var ConsoleFileDescriptor = class _ConsoleFileDescriptor extends BaseFileDescriptor {
  constructor(deviceId, fd11, rights_base, rights_inheriting, fdflags11, inode6) {
    super(deviceId, fd11, Filetype.character_device, rights_base, rights_inheriting, fdflags11, inode6);
  }
  with(change) {
    return new _ConsoleFileDescriptor(this.deviceId, change.fd, this.rights_base, this.rights_inheriting, this.fdflags, this.inode);
  }
};
var uri = import_vscode.Uri.from({ scheme: "wasi-console", authority: "f36f1dd6-913a-417f-a53c-360730fde485" });
function create(deviceId) {
  let inodeCounter = 0n;
  const decoder = ral_default().TextDecoder.create();
  function createConsoleFileDescriptor(fd11) {
    return new ConsoleFileDescriptor(deviceId, fd11, ConsoleBaseRights, ConsoleInheritingRights, 0, inodeCounter++);
  }
  const deviceDriver = {
    kind: "character" /* character */,
    id: deviceId,
    uri,
    createStdioFileDescriptor(fd11) {
      return createConsoleFileDescriptor(fd11);
    },
    fd_fdstat_get(fileDescriptor, result) {
      result.fs_filetype = fileDescriptor.fileType;
      result.fs_flags = fileDescriptor.fdflags;
      result.fs_rights_base = fileDescriptor.rights_base;
      result.fs_rights_inheriting = fileDescriptor.rights_inheriting;
      return Promise.resolve();
    },
    fd_filestat_get(fileDescriptor, result) {
      result.dev = fileDescriptor.deviceId;
      result.ino = fileDescriptor.inode;
      result.filetype = Filetype.character_device;
      result.nlink = 0n;
      result.size = 101n;
      const now = BigInt(Date.now());
      result.atim = now;
      result.ctim = now;
      result.mtim = now;
      return Promise.resolve();
    },
    fd_write(_fileDescriptor, buffers) {
      let buffer;
      if (buffers.length === 1) {
        buffer = buffers[0];
      } else {
        const byteLength = buffers.reduce((prev, current) => prev + current.length, 0);
        buffer = new Uint8Array(byteLength);
        let offset = 0;
        for (const item of buffers) {
          buffer.set(item, offset);
          offset = item.byteLength;
        }
      }
      ral_default().console.log(decoder.decode(buffer));
      return Promise.resolve(buffer.byteLength);
    }
  };
  return Object.assign({}, NoSysDeviceDriver, deviceDriver);
}

// src/common/vscodeFileSystemDriver.ts
var import_vscode2 = require("vscode");

// src/common/linkedMap.ts
var Touch;
((Touch2) => {
  Touch2.None = 0;
  Touch2.First = 1;
  Touch2.AsOld = Touch2.First;
  Touch2.Last = 2;
  Touch2.AsNew = Touch2.Last;
})(Touch || (Touch = {}));
var _a;
var LinkedMap = class {
  constructor() {
    __publicField(this, _a, "LinkedMap");
    __publicField(this, "_map");
    __publicField(this, "_head");
    __publicField(this, "_tail");
    __publicField(this, "_size");
    __publicField(this, "_state");
    this._map = /* @__PURE__ */ new Map();
    this._head = void 0;
    this._tail = void 0;
    this._size = 0;
    this._state = 0;
  }
  clear() {
    this._map.clear();
    this._head = void 0;
    this._tail = void 0;
    this._size = 0;
    this._state++;
  }
  isEmpty() {
    return !this._head && !this._tail;
  }
  get size() {
    return this._size;
  }
  get first() {
    return this._head?.value;
  }
  get last() {
    return this._tail?.value;
  }
  has(key) {
    return this._map.has(key);
  }
  get(key, touch = Touch.None) {
    const item = this._map.get(key);
    if (!item) {
      return void 0;
    }
    if (touch !== Touch.None) {
      this.touch(item, touch);
    }
    return item.value;
  }
  set(key, value, touch = Touch.None) {
    let item = this._map.get(key);
    if (item) {
      item.value = value;
      if (touch !== Touch.None) {
        this.touch(item, touch);
      }
    } else {
      item = { key, value, next: void 0, previous: void 0 };
      switch (touch) {
        case Touch.None:
          this.addItemLast(item);
          break;
        case Touch.First:
          this.addItemFirst(item);
          break;
        case Touch.Last:
          this.addItemLast(item);
          break;
        default:
          this.addItemLast(item);
          break;
      }
      this._map.set(key, item);
      this._size++;
    }
    return this;
  }
  delete(key) {
    return !!this.remove(key);
  }
  remove(key) {
    const item = this._map.get(key);
    if (!item) {
      return void 0;
    }
    this._map.delete(key);
    this.removeItem(item);
    this._size--;
    return item.value;
  }
  shift() {
    if (!this._head && !this._tail) {
      return void 0;
    }
    if (!this._head || !this._tail) {
      throw new Error("Invalid list");
    }
    const item = this._head;
    this._map.delete(item.key);
    this.removeItem(item);
    this._size--;
    return item.value;
  }
  forEach(callbackfn, thisArg) {
    const state = this._state;
    let current = this._head;
    while (current) {
      if (thisArg) {
        callbackfn.bind(thisArg)(current.value, current.key, this);
      } else {
        callbackfn(current.value, current.key, this);
      }
      if (this._state !== state) {
        throw new Error(`LinkedMap got modified during iteration.`);
      }
      current = current.next;
    }
  }
  keys() {
    const state = this._state;
    let current = this._head;
    const iterator = {
      [Symbol.iterator]: () => {
        return iterator;
      },
      next: () => {
        if (this._state !== state) {
          throw new Error(`LinkedMap got modified during iteration.`);
        }
        if (current) {
          const result = { value: current.key, done: false };
          current = current.next;
          return result;
        } else {
          return { value: void 0, done: true };
        }
      }
    };
    return iterator;
  }
  values() {
    const state = this._state;
    let current = this._head;
    const iterator = {
      [Symbol.iterator]: () => {
        return iterator;
      },
      next: () => {
        if (this._state !== state) {
          throw new Error(`LinkedMap got modified during iteration.`);
        }
        if (current) {
          const result = { value: current.value, done: false };
          current = current.next;
          return result;
        } else {
          return { value: void 0, done: true };
        }
      }
    };
    return iterator;
  }
  entries() {
    const state = this._state;
    let current = this._head;
    const iterator = {
      [Symbol.iterator]: () => {
        return iterator;
      },
      next: () => {
        if (this._state !== state) {
          throw new Error(`LinkedMap got modified during iteration.`);
        }
        if (current) {
          const result = { value: [current.key, current.value], done: false };
          current = current.next;
          return result;
        } else {
          return { value: void 0, done: true };
        }
      }
    };
    return iterator;
  }
  [(_a = Symbol.toStringTag, Symbol.iterator)]() {
    return this.entries();
  }
  trimOld(newSize) {
    if (newSize >= this.size) {
      return;
    }
    if (newSize === 0) {
      this.clear();
      return;
    }
    let current = this._head;
    let currentSize = this.size;
    while (current && currentSize > newSize) {
      this._map.delete(current.key);
      current = current.next;
      currentSize--;
    }
    this._head = current;
    this._size = currentSize;
    if (current) {
      current.previous = void 0;
    }
    this._state++;
  }
  addItemFirst(item) {
    if (!this._head && !this._tail) {
      this._tail = item;
    } else if (!this._head) {
      throw new Error("Invalid list");
    } else {
      item.next = this._head;
      this._head.previous = item;
    }
    this._head = item;
    this._state++;
  }
  addItemLast(item) {
    if (!this._head && !this._tail) {
      this._head = item;
    } else if (!this._tail) {
      throw new Error("Invalid list");
    } else {
      item.previous = this._tail;
      this._tail.next = item;
    }
    this._tail = item;
    this._state++;
  }
  removeItem(item) {
    if (item === this._head && item === this._tail) {
      this._head = void 0;
      this._tail = void 0;
    } else if (item === this._head) {
      if (!item.next) {
        throw new Error("Invalid list");
      }
      item.next.previous = void 0;
      this._head = item.next;
    } else if (item === this._tail) {
      if (!item.previous) {
        throw new Error("Invalid list");
      }
      item.previous.next = void 0;
      this._tail = item.previous;
    } else {
      const next = item.next;
      const previous = item.previous;
      if (!next || !previous) {
        throw new Error("Invalid list");
      }
      next.previous = previous;
      previous.next = next;
    }
    item.next = void 0;
    item.previous = void 0;
    this._state++;
  }
  touch(item, touch) {
    if (!this._head || !this._tail) {
      throw new Error("Invalid list");
    }
    if (touch !== Touch.First && touch !== Touch.Last) {
      return;
    }
    if (touch === Touch.First) {
      if (item === this._head) {
        return;
      }
      const next = item.next;
      const previous = item.previous;
      if (item === this._tail) {
        previous.next = void 0;
        this._tail = previous;
      } else {
        next.previous = previous;
        previous.next = next;
      }
      item.previous = void 0;
      item.next = this._head;
      this._head.previous = item;
      this._head = item;
      this._state++;
    } else if (touch === Touch.Last) {
      if (item === this._tail) {
        return;
      }
      const next = item.next;
      const previous = item.previous;
      if (item === this._head) {
        next.previous = void 0;
        this._head = next;
      } else {
        next.previous = previous;
        previous.next = next;
      }
      item.next = void 0;
      item.previous = this._tail;
      this._tail.next = item;
      this._tail = item;
      this._state++;
    }
  }
  toJSON() {
    const data = [];
    this.forEach((value, key) => {
      data.push([key, value]);
    });
    return data;
  }
  fromJSON(data) {
    this.clear();
    for (const [key, value] of data) {
      this.set(key, value);
    }
  }
};
var LRUCache = class extends LinkedMap {
  constructor(limit, ratio = 1) {
    super();
    __publicField(this, "_limit");
    __publicField(this, "_ratio");
    this._limit = limit;
    this._ratio = Math.min(Math.max(0, ratio), 1);
  }
  get limit() {
    return this._limit;
  }
  set limit(limit) {
    this._limit = limit;
    this.checkTrim();
  }
  get ratio() {
    return this._ratio;
  }
  set ratio(ratio) {
    this._ratio = Math.min(Math.max(0, ratio), 1);
    this.checkTrim();
  }
  get(key, touch = Touch.AsNew) {
    return super.get(key, touch);
  }
  peek(key) {
    return super.get(key, Touch.None);
  }
  set(key, value) {
    super.set(key, value, Touch.Last);
    this.checkTrim();
    return this;
  }
  checkTrim() {
    if (this.size > this._limit) {
      this.trimOld(Math.round(this._limit * this._ratio));
    }
  }
};

// src/common/vscodeFileSystemDriver.ts
var _DirectoryBaseRights = Rights.fd_fdstat_set_flags | Rights.path_create_directory | Rights.path_create_file | Rights.path_link_source | Rights.path_link_target | Rights.path_open | Rights.fd_readdir | Rights.path_readlink | Rights.path_rename_source | Rights.path_rename_target | Rights.path_filestat_get | Rights.path_filestat_set_size | Rights.path_filestat_set_times | Rights.fd_filestat_get | Rights.fd_filestat_set_times | Rights.path_remove_directory | Rights.path_unlink_file | Rights.path_symlink;
var _DirectoryBaseRightsReadonly = _DirectoryBaseRights & Rights.ReadOnly;
function getDirectoryBaseRights(readOnly = false) {
  return readOnly ? _DirectoryBaseRightsReadonly : _DirectoryBaseRights;
}
var _FileBaseRights = Rights.fd_datasync | Rights.fd_read | Rights.fd_seek | Rights.fd_fdstat_set_flags | Rights.fd_sync | Rights.fd_tell | Rights.fd_write | Rights.fd_advise | Rights.fd_allocate | Rights.fd_filestat_get | Rights.fd_filestat_set_size | Rights.fd_filestat_set_times | Rights.poll_fd_readwrite;
var _FileBaseRightsReadOnly = _FileBaseRights & Rights.ReadOnly;
function getFileBaseRights(readOnly = false) {
  return readOnly ? _FileBaseRightsReadOnly : _FileBaseRights;
}
var _DirectoryInheritingRights = _DirectoryBaseRights | _FileBaseRights;
var _DirectoryInheritingRightsReadonly = _DirectoryInheritingRights & Rights.ReadOnly;
function getDirectoryInheritingRights(readOnly = false) {
  return readOnly ? _DirectoryInheritingRightsReadonly : _DirectoryInheritingRights;
}
var _FileInheritingRights = 0n;
var _FileInheritingRightsReadonly = _FileInheritingRights & Rights.ReadOnly;
function getFileInheritingRights(readOnly = false) {
  return readOnly ? _FileInheritingRightsReadonly : _FileInheritingRights;
}
var DirectoryOnlyBaseRights = getDirectoryBaseRights() & ~getFileBaseRights();
var FileOnlyBaseRights = getFileBaseRights() & ~getDirectoryBaseRights();
var StdInFileRights = Rights.fd_read | Rights.fd_seek | Rights.fd_tell | Rights.fd_advise | Rights.fd_filestat_get | Rights.poll_fd_readwrite;
var StdoutFileRights = getFileBaseRights() & ~Rights.fd_read;
var FileFileDescriptor = class _FileFileDescriptor extends BaseFileDescriptor {
  constructor(deviceId, fd11, rights_base, fdflags11, inode6) {
    super(deviceId, fd11, Filetype.regular_file, rights_base, 0n, fdflags11, inode6);
    /**
     * The cursor into the file's content;
     */
    __publicField(this, "_cursor");
    this._cursor = 0;
  }
  with(change) {
    return new _FileFileDescriptor(this.deviceId, change.fd, this.rights_base, this.fdflags, this.inode);
  }
  get cursor() {
    return this._cursor;
  }
  set cursor(value) {
    if (value < 0) {
      throw new WasiError(Errno.inval);
    }
    this._cursor = value;
  }
};
var DirectoryFileDescriptor = class _DirectoryFileDescriptor extends BaseFileDescriptor {
  constructor(deviceId, fd11, rights_base, rights_inheriting, fdflags11, inode6) {
    super(deviceId, fd11, Filetype.directory, rights_base, rights_inheriting, fdflags11, inode6);
  }
  with(change) {
    return new _DirectoryFileDescriptor(this.deviceId, change.fd, this.rights_base, this.rights_inheriting, this.fdflags, this.inode);
  }
  childDirectoryRights(requested_rights) {
    return this.rights_inheriting & requested_rights & ~FileOnlyBaseRights;
  }
  childFileRights(requested_rights) {
    return this.rights_inheriting & requested_rights & ~DirectoryOnlyBaseRights;
  }
};
var FileNode;
((FileNode4) => {
  function create8(id, parent) {
    return {
      kind: 0 /* File */,
      inode: id,
      refs: 0,
      parent,
      name: void 0
    };
  }
  FileNode4.create = create8;
})(FileNode || (FileNode = {}));
var DirectoryNode;
((DirectoryNode4) => {
  function create8(id, parent) {
    return {
      kind: 1 /* Directory */,
      inode: id,
      refs: 0,
      parent,
      name: void 0,
      entries: /* @__PURE__ */ new Map()
    };
  }
  DirectoryNode4.create = create8;
})(DirectoryNode || (DirectoryNode = {}));
var _FileSystem = class _FileSystem {
  constructor(vscfs) {
    __publicField(this, "vscfs");
    __publicField(this, "root");
    __publicField(this, "inodes");
    // Cache contents of files
    __publicField(this, "contents");
    // Cached stats for deleted files and directories if there is still
    // an open file descriptor
    __publicField(this, "stats");
    __publicField(this, "deletedNodes");
    __publicField(this, "pathCache");
    this.vscfs = vscfs;
    this.root = {
      kind: 1 /* Directory */,
      inode: _FileSystem.inodeCounter++,
      parent: void 0,
      refs: 1,
      name: "/",
      entries: /* @__PURE__ */ new Map()
    };
    this.inodes = /* @__PURE__ */ new Map();
    this.inodes.set(this.root.inode, this.root);
    this.contents = /* @__PURE__ */ new Map();
    this.stats = /* @__PURE__ */ new Map();
    this.deletedNodes = /* @__PURE__ */ new Map();
    this.pathCache = new LRUCache(256);
  }
  getRoot() {
    return this.root;
  }
  getUri(node, fsPath) {
    const paths2 = ral_default().path;
    const finalPath = fsPath === void 0 || fsPath === "." ? this.getPath(node) : paths2.join(this.getPath(node), fsPath);
    return this.vscfs.with({ path: paths2.join(this.vscfs.path, finalPath) });
  }
  getNode(id, kind) {
    const node = this.inodes.get(id) ?? this.deletedNodes.get(id);
    if (node === void 0) {
      throw new WasiError(Errno.noent);
    }
    this.assertNodeKind(node, kind);
    return node;
  }
  getOrCreateNode(parent, path2, kind, ref) {
    const parts = this.getPathSegments(path2);
    if (parts.length === 1) {
      if (parts[0] === ".") {
        return parent;
      } else if (parts[0] === "..") {
        if (parent.parent !== void 0) {
          return parent.parent;
        } else {
          throw new WasiError(Errno.noent);
        }
      }
    }
    let current = parent;
    for (let i = 0; i < parts.length; i++) {
      switch (current.kind) {
        case 0 /* File */:
          throw new WasiError(Errno.notdir);
        case 1 /* Directory */:
          let entry = current.entries.get(parts[i]);
          if (entry === void 0) {
            if (i === parts.length - 1) {
              entry = kind === 0 /* File */ ? FileNode.create(_FileSystem.inodeCounter++, current) : DirectoryNode.create(_FileSystem.inodeCounter++, current);
              if (ref) {
                entry.refs++;
              }
            } else {
              entry = DirectoryNode.create(_FileSystem.inodeCounter++, current);
            }
            current.entries.set(parts[i], entry);
            entry.name = parts[i];
            this.inodes.set(entry.inode, entry);
          } else {
            if (i === parts.length - 1 && ref) {
              entry.refs++;
            }
          }
          current = entry;
          break;
      }
    }
    return current;
  }
  getNodeByPath(parent, path2, kind) {
    const parts = this.getPathSegments(path2);
    if (parts.length === 1) {
      if (parts[0] === ".") {
        return parent;
      } else if (parts[0] === "..") {
        return parent.parent;
      }
    }
    let current = parent;
    for (let i = 0; i < parts.length; i++) {
      switch (current.kind) {
        case 0 /* File */:
          return void 0;
        case 1 /* Directory */:
          current = current.entries.get(parts[i]);
          if (current === void 0) {
            return void 0;
          }
          break;
      }
    }
    if (current !== void 0) {
      this.assertNodeKind(current, kind);
    }
    return current;
  }
  existsNode(parent, path2) {
    return this.getNodeByPath(parent, path2) !== void 0;
  }
  setContent(inode6, content) {
    this.contents.set(inode6.inode, content);
  }
  async getContent(inode6, contentProvider) {
    let content = this.contents.get(inode6.inode);
    if (content === void 0) {
      content = await contentProvider.readFile(this.getUri(inode6));
      this.contents.set(inode6.inode, content);
    }
    return Promise.resolve(content);
  }
  getStat(inode6) {
    const result = this.stats.get(inode6);
    if (result === void 0) {
      throw new WasiError(Errno.noent);
    }
    return result;
  }
  deleteNode(node, stat, content) {
    if (node.parent === void 0) {
      throw new WasiError(Errno.badf);
    }
    if (node.refs > 0 && (stat === void 0 || node.kind === 0 /* File */ && content === void 0)) {
      throw new WasiError(Errno.inval);
    }
    const name = this.getName(node);
    node.parent.entries.delete(name);
    if (content !== void 0) {
      this.contents.set(node.inode, content);
    }
    if (stat !== void 0) {
      this.stats.set(node.inode, stat);
    }
    this.freeNode(node);
  }
  isNodeDeleted(inode6) {
    return this.deletedNodes.has(inode6);
  }
  renameNode(oldNode, stat, content, newParent, newPath) {
    this.deleteNode(oldNode, stat, content);
    this.getOrCreateNode(newParent, newPath, oldNode.kind, false);
  }
  closeNode(id) {
    const node = this.getNode(id);
    if (node.refs <= 0) {
      throw new WasiError(Errno.badf);
    }
    node.refs--;
    if (node.refs === 0) {
      if (node.kind === 0 /* File */) {
        this.contents.delete(node.inode);
        this.stats.delete(node.inode);
      }
      this.deletedNodes.delete(node.inode);
    }
  }
  assertNodeKind(node, kind) {
    if (kind === void 0) {
      return;
    }
    if (kind === 0 /* File */ && node.kind !== 0 /* File */) {
      throw new WasiError(Errno.isdir);
    } else if (kind === 1 /* Directory */ && node.kind !== 1 /* Directory */) {
      throw new WasiError(Errno.notdir);
    }
  }
  freeNode(inode6) {
    this.inodes.delete(inode6.inode);
    this.pathCache.delete(inode6);
    inode6.name = void 0;
    if (inode6.refs > 0) {
      this.deletedNodes.set(inode6.inode, inode6);
    }
    if (inode6.kind === 1 /* Directory */) {
      for (const child of inode6.entries.values()) {
        this.freeNode(child);
      }
    }
  }
  getPathSegments(path2) {
    if (path2.charAt(0) === "/") {
      path2 = path2.substring(1);
    }
    if (path2.charAt(path2.length - 1) === "/") {
      path2 = path2.substring(0, path2.length - 1);
    }
    return path2.normalize().split("/");
  }
  getPath(inode6) {
    let result = this.pathCache.get(inode6);
    if (result === void 0) {
      const parts = [];
      let current = inode6;
      do {
        parts.push(this.getName(current));
        current = current.parent;
      } while (current !== void 0);
      result = parts.reverse().join("/");
      this.pathCache.set(inode6, result);
    }
    return result;
  }
  getName(inode6) {
    if (inode6.name !== void 0) {
      return inode6.name;
    }
    const parent = inode6.parent;
    if (parent === void 0) {
      throw new Error("The root node must always have a name");
    }
    for (const [name, child] of parent.entries) {
      if (child === inode6) {
        inode6.name = name;
        return name;
      }
    }
    throw new WasiError(Errno.noent);
  }
};
__publicField(_FileSystem, "inodeCounter", 1n);
var FileSystem = _FileSystem;
function create2(deviceId, baseUri, readOnly = false) {
  const vscode_fs = import_vscode2.workspace.fs;
  const fs = new FileSystem(baseUri);
  function createFileDescriptor(parentDescriptor, fd11, rights_base, fdflags11, path2) {
    const parentNode = fs.getNode(parentDescriptor.inode, 1 /* Directory */);
    return new FileFileDescriptor(deviceId, fd11, rights_base, fdflags11, fs.getOrCreateNode(parentNode, path2, 0 /* File */, true).inode);
  }
  function assertFileDescriptor(fileDescriptor) {
    if (!(fileDescriptor instanceof FileFileDescriptor)) {
      throw new WasiError(Errno.badf);
    }
  }
  function createDirectoryDescriptor(parentDescriptor, fd11, rights_base, rights_inheriting, fdflags11, path2) {
    const parentNode = fs.getNode(parentDescriptor.inode, 1 /* Directory */);
    return new DirectoryFileDescriptor(deviceId, fd11, rights_base, rights_inheriting, fdflags11, fs.getOrCreateNode(parentNode, path2, 1 /* Directory */, true).inode);
  }
  function assertDirectoryDescriptor(fileDescriptor) {
    if (!(fileDescriptor instanceof DirectoryFileDescriptor)) {
      throw new WasiError(Errno.badf);
    }
  }
  function createRootFileDescriptor(fd11) {
    return new DirectoryFileDescriptor(deviceId, fd11, getDirectoryBaseRights(readOnly), getDirectoryInheritingRights(readOnly), 0, fs.getRoot().inode);
  }
  async function doGetFiletype(fileDescriptor, path2) {
    const inode6 = fs.getNode(fileDescriptor.inode, 1 /* Directory */);
    try {
      const stat = await vscode_fs.stat(fs.getUri(inode6, path2));
      return code2Wasi.asFileType(stat.type);
    } catch {
      return void 0;
    }
  }
  function assignStat(result, inode6, vStat) {
    result.dev = deviceId;
    result.ino = inode6;
    result.filetype = code2Wasi.asFileType(vStat.type);
    result.nlink = 1n;
    result.size = BigInt(vStat.size);
    result.atim = timeInNanoseconds2(vStat.mtime);
    result.ctim = timeInNanoseconds2(vStat.ctime);
    result.mtim = timeInNanoseconds2(vStat.mtime);
  }
  function timeInNanoseconds2(timeInMilliseconds) {
    return BigInt(timeInMilliseconds) * 1000000n;
  }
  function read(content, offset, buffers) {
    let totalBytesRead = 0;
    for (const buffer of buffers) {
      const toRead = Math.min(buffer.length, content.byteLength - offset);
      buffer.set(content.subarray(offset, offset + toRead));
      totalBytesRead += toRead;
      if (toRead < buffer.length) {
        break;
      }
      offset += toRead;
    }
    return totalBytesRead;
  }
  function write(content, offset, buffers) {
    let bytesToWrite = 0;
    for (const bytes of buffers) {
      bytesToWrite += bytes.byteLength;
    }
    if (offset + bytesToWrite > content.byteLength) {
      const newContent = new Uint8Array(offset + bytesToWrite);
      newContent.set(content);
      content = newContent;
    }
    for (const bytes of buffers) {
      content.set(bytes, offset);
      offset += bytes.length;
    }
    return [content, bytesToWrite];
  }
  async function createOrTruncate(fileDescriptor) {
    const content = new Uint8Array(0);
    const inode6 = fs.getNode(fileDescriptor.inode, 0 /* File */);
    fileDescriptor.cursor = 0;
    return writeContent(inode6, content);
  }
  async function writeContent(node, content) {
    const toWrite = content ?? await fs.getContent(node, vscode_fs);
    await vscode_fs.writeFile(fs.getUri(node), toWrite);
    if (content !== void 0) {
      fs.setContent(node, content);
    }
  }
  const $this = {
    kind: "fileSystem" /* fileSystem */,
    uri: baseUri,
    id: deviceId,
    joinPath(...pathSegments) {
      return import_vscode2.Uri.joinPath(baseUri, ...pathSegments);
    },
    createStdioFileDescriptor(dirflags = Lookupflags.none, path2, _oflags = Oflags.none, _fs_rights_base, fdflags11 = Fdflags.none, fd11) {
      if (path2.length === 0) {
        throw new WasiError(Errno.inval);
      }
      const fs_rights_base = _fs_rights_base ?? fd11 === 0 ? StdInFileRights : StdoutFileRights;
      const oflags8 = _oflags ?? fd11 === 0 ? Oflags.none : Oflags.creat | Oflags.trunc;
      const parentDescriptor = createRootFileDescriptor(999999);
      return $this.path_open(parentDescriptor, dirflags, path2, oflags8, fs_rights_base, getFileInheritingRights(readOnly), fdflags11, { next: () => fd11 });
    },
    fd_create_prestat_fd(fd11) {
      return Promise.resolve(createRootFileDescriptor(fd11));
    },
    fd_advise(_fileDescriptor, _offset, _length, _advise) {
      return Promise.resolve();
    },
    async fd_allocate(fileDescriptor, _offset, _len) {
      assertFileDescriptor(fileDescriptor);
      const offset = BigInts.asNumber(_offset);
      const len = BigInts.asNumber(_len);
      const inode6 = fs.getNode(fileDescriptor.inode, 0 /* File */);
      const content = await fs.getContent(inode6, vscode_fs);
      if (offset > content.byteLength) {
        throw new WasiError(Errno.inval);
      }
      const newContent = new Uint8Array(content.byteLength + len);
      newContent.set(content.subarray(0, offset), 0);
      newContent.set(content.subarray(offset), offset + len);
      return writeContent(inode6, newContent);
    },
    fd_close(fileDescriptor) {
      fs.closeNode(fileDescriptor.inode);
      return Promise.resolve();
    },
    fd_datasync(fileDescriptor) {
      assertFileDescriptor(fileDescriptor);
      const node = fs.getNode(fileDescriptor.inode, 0 /* File */);
      return writeContent(node);
    },
    fd_fdstat_get(fileDescriptor, result) {
      result.fs_filetype = fileDescriptor.fileType;
      result.fs_flags = fileDescriptor.fdflags;
      result.fs_rights_base = fileDescriptor.rights_base;
      result.fs_rights_inheriting = fileDescriptor.rights_inheriting;
      return Promise.resolve();
    },
    fd_fdstat_set_flags(fileDescriptor, fdflags11) {
      fileDescriptor.fdflags = fdflags11;
      return Promise.resolve();
    },
    async fd_filestat_get(fileDescriptor, result) {
      if (fs.isNodeDeleted(fileDescriptor.inode)) {
        assignStat(result, fileDescriptor.inode, fs.getStat(fileDescriptor.inode));
        return;
      }
      const inode6 = fs.getNode(fileDescriptor.inode);
      const vStat = await vscode_fs.stat(fs.getUri(inode6));
      assignStat(result, inode6.inode, vStat);
    },
    async fd_filestat_set_size(fileDescriptor, _size) {
      assertFileDescriptor(fileDescriptor);
      const size = BigInts.asNumber(_size);
      const node = fs.getNode(fileDescriptor.inode, 0 /* File */);
      const content = await fs.getContent(node, vscode_fs);
      if (content.byteLength === size) {
        return;
      } else if (content.byteLength < size) {
        const newContent = new Uint8Array(size);
        newContent.set(content);
        await writeContent(node, newContent);
      } else if (content.byteLength > size) {
        const newContent = new Uint8Array(size);
        newContent.set(content.subarray(0, size));
        await writeContent(node, newContent);
      }
    },
    fd_filestat_set_times(_fileDescriptor, _atim, _mtim, _fst_flags) {
      throw new WasiError(Errno.nosys);
    },
    async fd_pread(fileDescriptor, _offset, buffers) {
      const offset = BigInts.asNumber(_offset);
      const content = await fs.getContent(fs.getNode(fileDescriptor.inode, 0 /* File */), vscode_fs);
      return read(content, offset, buffers);
    },
    async fd_pwrite(fileDescriptor, _offset, buffers) {
      const offset = BigInts.asNumber(_offset);
      const inode6 = fs.getNode(fileDescriptor.inode, 0 /* File */);
      const [newContent, bytesWritten] = write(await fs.getContent(inode6, vscode_fs), offset, buffers);
      await writeContent(inode6, newContent);
      return bytesWritten;
    },
    async fd_read(fileDescriptor, buffers) {
      if (buffers.length === 0) {
        return 0;
      }
      assertFileDescriptor(fileDescriptor);
      const content = await fs.getContent(fs.getNode(fileDescriptor.inode, 0 /* File */), vscode_fs);
      const offset = fileDescriptor.cursor;
      const totalBytesRead = read(content, offset, buffers);
      fileDescriptor.cursor = fileDescriptor.cursor + totalBytesRead;
      return totalBytesRead;
    },
    async fd_readdir(fileDescriptor) {
      assertDirectoryDescriptor(fileDescriptor);
      const directoryNode = fs.getNode(fileDescriptor.inode, 1 /* Directory */);
      const entries = await vscode_fs.readDirectory(fs.getUri(directoryNode));
      const result = [];
      for (const entry of entries) {
        const name = entry[0];
        const filetype5 = code2Wasi.asFileType(entry[1]);
        const nodeKind = filetype5 === Filetype.directory ? 1 /* Directory */ : 0 /* File */;
        result.push({ d_ino: fs.getOrCreateNode(directoryNode, name, nodeKind, false).inode, d_type: filetype5, d_name: name });
      }
      return result;
    },
    async fd_seek(fileDescriptor, _offset, whence3) {
      assertFileDescriptor(fileDescriptor);
      const offset = BigInts.asNumber(_offset);
      switch (whence3) {
        case Whence.set:
          fileDescriptor.cursor = offset;
          break;
        case Whence.cur:
          fileDescriptor.cursor = fileDescriptor.cursor + offset;
          break;
        case Whence.end:
          const content = await fs.getContent(fs.getNode(fileDescriptor.inode, 0 /* File */), vscode_fs);
          fileDescriptor.cursor = Math.max(0, content.byteLength - offset);
          break;
      }
      return BigInt(fileDescriptor.cursor);
    },
    fd_renumber(fileDescriptor, _to) {
      assertFileDescriptor(fileDescriptor);
      return Promise.resolve();
    },
    async fd_sync(fileDescriptor) {
      return writeContent(fs.getNode(fileDescriptor.inode, 0 /* File */));
    },
    fd_tell(fileDescriptor) {
      assertFileDescriptor(fileDescriptor);
      return Promise.resolve(BigInt(fileDescriptor.cursor));
    },
    async fd_write(fileDescriptor, buffers) {
      if (buffers.length === 0) {
        return 0;
      }
      assertFileDescriptor(fileDescriptor);
      const inode6 = fs.getNode(fileDescriptor.inode, 0 /* File */);
      const content = await fs.getContent(inode6, vscode_fs);
      if (Fdflags.appendOn(fileDescriptor.fdflags)) {
        fileDescriptor.cursor = content.byteLength;
      }
      const [newContent, bytesWritten] = write(content, fileDescriptor.cursor, buffers);
      await writeContent(inode6, newContent);
      fileDescriptor.cursor = fileDescriptor.cursor + bytesWritten;
      return bytesWritten;
    },
    async path_create_directory(fileDescriptor, path2) {
      const inode6 = fs.getNode(fileDescriptor.inode, 1 /* Directory */);
      await vscode_fs.createDirectory(fs.getUri(inode6, path2));
    },
    async path_filestat_get(fileDescriptor, _flags, path2, result) {
      assertDirectoryDescriptor(fileDescriptor);
      const inode6 = fs.getNode(fileDescriptor.inode, 1 /* Directory */);
      const vStat = await vscode_fs.stat(fs.getUri(inode6, path2));
      assignStat(result, fs.getOrCreateNode(inode6, path2, vStat.type === import_vscode2.FileType.Directory ? 1 /* Directory */ : 0 /* File */, false).inode, vStat);
    },
    path_filestat_set_times(_fileDescriptor, _flags, _path, _atim, _mtim, _fst_flags) {
      throw new WasiError(Errno.nosys);
    },
    path_link(_oldFileDescriptor, _old_flags, _old_path, _newFileDescriptor, _new_path) {
      throw new WasiError(Errno.nosys);
    },
    async path_open(parentDescriptor, _dirflags, path2, oflags8, fs_rights_base, fs_rights_inheriting, fdflags11, fdProvider) {
      assertDirectoryDescriptor(parentDescriptor);
      parentDescriptor.assertRights(fs_rights_base);
      parentDescriptor.assertInheritingRights(fs_rights_inheriting);
      let filetype5 = await doGetFiletype(parentDescriptor, path2);
      const entryExists = filetype5 !== void 0;
      if (entryExists) {
        if (Oflags.exclOn(oflags8)) {
          throw new WasiError(Errno.exist);
        } else if (Oflags.directoryOn(oflags8) && filetype5 !== Filetype.directory) {
          throw new WasiError(Errno.notdir);
        }
      } else {
        if (Oflags.creatOff(oflags8)) {
          throw new WasiError(Errno.noent);
        }
      }
      let createFile = false;
      if (Oflags.creatOn(oflags8) && !entryExists) {
        parentDescriptor.assertIsDirectory();
        const dirname = ral_default().path.dirname(path2);
        if (dirname !== ".") {
          const dirFiletype = await doGetFiletype(parentDescriptor, dirname);
          if (dirFiletype === void 0 || dirFiletype !== Filetype.directory) {
            throw new WasiError(Errno.noent);
          }
        }
        filetype5 = Filetype.regular_file;
        createFile = true;
      } else {
        if (filetype5 === void 0) {
          throw new WasiError(Errno.noent);
        }
      }
      if (filetype5 !== Filetype.regular_file && filetype5 !== Filetype.directory) {
        throw new WasiError(Errno.badf);
      }
      const result = filetype5 === Filetype.regular_file ? createFileDescriptor(parentDescriptor, fdProvider.next(), parentDescriptor.childFileRights(fs_rights_base), fdflags11, path2) : createDirectoryDescriptor(parentDescriptor, fdProvider.next(), parentDescriptor.childDirectoryRights(fs_rights_base), fs_rights_inheriting | getDirectoryInheritingRights(readOnly), fdflags11, path2);
      if (result instanceof FileFileDescriptor && (createFile || Oflags.truncOn(oflags8))) {
        await createOrTruncate(result);
      }
      return result;
    },
    path_readlink(_fileDescriptor, _path) {
      throw new WasiError(Errno.nolink);
    },
    async path_remove_directory(fileDescriptor, path2) {
      assertDirectoryDescriptor(fileDescriptor);
      const inode6 = fs.getNode(fileDescriptor.inode, 1 /* Directory */);
      const targetNode = fs.getNodeByPath(inode6, path2, 1 /* Directory */);
      let filestat10;
      if (targetNode !== void 0 && targetNode.refs > 0) {
        try {
          filestat10 = await vscode_fs.stat(fs.getUri(targetNode));
        } catch {
          filestat10 = { type: import_vscode2.FileType.Directory, ctime: Date.now(), mtime: Date.now(), size: 0 };
        }
      }
      await vscode_fs.delete(fs.getUri(inode6, path2), { recursive: false, useTrash: ral_default().workbench.hasTrash });
      if (targetNode !== void 0) {
        if (filestat10 !== void 0) {
          fs.deleteNode(targetNode, filestat10);
        } else {
          fs.deleteNode(targetNode);
        }
      }
    },
    async path_rename(oldFileDescriptor, oldPath, newFileDescriptor, newPath) {
      assertDirectoryDescriptor(oldFileDescriptor);
      assertDirectoryDescriptor(newFileDescriptor);
      const newParentNode = fs.getNode(newFileDescriptor.inode, 1 /* Directory */);
      if (fs.existsNode(newParentNode, newPath)) {
        throw new WasiError(Errno.exist);
      }
      const oldParentNode = fs.getNode(oldFileDescriptor.inode, 1 /* Directory */);
      const oldNode = fs.getNodeByPath(oldParentNode, oldPath);
      let filestat10;
      let content;
      if (oldNode !== void 0 && oldNode.refs > 0) {
        try {
          const uri2 = fs.getUri(oldNode);
          filestat10 = await vscode_fs.stat(uri2);
          if (oldNode.kind === 0 /* File */) {
            content = await vscode_fs.readFile(uri2);
          }
        } catch {
          filestat10 = { type: import_vscode2.FileType.File, ctime: Date.now(), mtime: Date.now(), size: 0 };
          content = new Uint8Array(0);
        }
      }
      const oldUri = fs.getUri(oldParentNode, oldPath);
      const newUri = fs.getUri(newParentNode, newPath);
      await vscode_fs.rename(oldUri, newUri, { overwrite: false });
      if (oldNode !== void 0) {
        fs.renameNode(oldNode, filestat10, content, newParentNode, newPath);
      }
    },
    path_symlink(_oldPath, _fileDescriptor, _newPath) {
      throw new WasiError(Errno.nosys);
    },
    async path_unlink_file(fileDescriptor, path2) {
      assertDirectoryDescriptor(fileDescriptor);
      const inode6 = fs.getNode(fileDescriptor.inode, 1 /* Directory */);
      const targetNode = fs.getNodeByPath(inode6, path2, 0 /* File */);
      let filestat10;
      let content;
      if (targetNode !== void 0 && targetNode.refs > 0) {
        try {
          const uri2 = fs.getUri(targetNode);
          filestat10 = await vscode_fs.stat(uri2);
          content = await vscode_fs.readFile(uri2);
        } catch {
          filestat10 = { type: import_vscode2.FileType.File, ctime: Date.now(), mtime: Date.now(), size: 0 };
          content = new Uint8Array(0);
        }
      }
      await vscode_fs.delete(fs.getUri(inode6, path2), { recursive: false, useTrash: ral_default().workbench.hasTrash });
      if (targetNode !== void 0) {
        if (filestat10 !== void 0 && content !== void 0) {
          fs.deleteNode(targetNode, filestat10, content);
        } else {
          fs.deleteNode(targetNode);
        }
      }
    },
    async fd_bytesAvailable(fileDescriptor) {
      assertFileDescriptor(fileDescriptor);
      const inode6 = fs.getNode(fileDescriptor.inode, 0 /* File */);
      const cursor = fileDescriptor.cursor;
      const content = await fs.getContent(inode6, vscode_fs);
      return BigInt(Math.max(0, content.byteLength - cursor));
    }
  };
  return Object.assign({}, NoSysDeviceDriver, $this, readOnly ? WritePermDeniedDeviceDriver : {});
}

// src/common/extLocFileSystemDriver.ts
var import_vscode3 = require("vscode");
var DirectoryBaseRights = Rights.path_open | Rights.fd_readdir | Rights.path_filestat_get | Rights.fd_filestat_get;
var FileBaseRights = Rights.fd_read | Rights.fd_seek | Rights.fd_tell | Rights.fd_advise | Rights.fd_filestat_get | Rights.poll_fd_readwrite;
var DirectoryInheritingRights = DirectoryBaseRights | FileBaseRights;
var DirectoryOnlyBaseRights2 = DirectoryBaseRights & ~FileBaseRights;
var FileOnlyBaseRights2 = FileBaseRights & DirectoryBaseRights;
var FileNode2;
((FileNode4) => {
  function create8(parent, inode6, name, time, size) {
    return {
      kind: 0 /* File */,
      parent,
      inode: inode6,
      name,
      time,
      size,
      refs: 0,
      content: void 0
    };
  }
  FileNode4.create = create8;
})(FileNode2 || (FileNode2 = {}));
var DirectoryNode2;
((DirectoryNode4) => {
  function create8(parent, id, name, time, size) {
    return {
      kind: 1 /* Directory */,
      inode: id,
      name,
      time,
      size,
      refs: 0,
      parent,
      entries: /* @__PURE__ */ new Map()
    };
  }
  DirectoryNode4.create = create8;
})(DirectoryNode2 || (DirectoryNode2 = {}));
var FileSystem2 = class {
  constructor(baseUri, dump) {
    __publicField(this, "baseUri");
    __publicField(this, "root");
    this.baseUri = baseUri;
    this.root = this.parseDump(dump);
  }
  getRoot() {
    return this.root;
  }
  refNode(node) {
    node.refs++;
  }
  unrefNode(node) {
    node.refs--;
    if (node.refs === 0 && node.kind === 0 /* File */) {
      node.content = void 0;
    }
  }
  async getContent(node) {
    if (node.content !== void 0) {
      return node.content;
    }
    try {
      const segments = this.getSegmentsFromNode(node);
      const vscode_fs = import_vscode3.Uri.joinPath(this.baseUri, ...segments);
      const content = await import_vscode3.workspace.fs.readFile(vscode_fs);
      node.content = content;
      return node.content;
    } catch (error) {
      throw new WasiError(Errno.noent);
    }
  }
  findNode(parent, path2) {
    const parts = this.getSegmentsFromPath(path2);
    if (parts.length === 1) {
      if (parts[0] === ".") {
        return parent;
      } else if (parts[0] === "..") {
        return parent.parent;
      }
    }
    let current = parent;
    for (let i = 0; i < parts.length; i++) {
      switch (current.kind) {
        case 0 /* File */:
          return void 0;
        case 1 /* Directory */:
          current = current.entries.get(parts[i]);
          if (current === void 0) {
            return void 0;
          }
          break;
      }
    }
    return current;
  }
  getSegmentsFromNode(node) {
    const parts = [];
    let current = node;
    do {
      parts.push(current.name);
      current = current.parent;
    } while (current !== void 0);
    return parts.reverse();
  }
  getSegmentsFromPath(path2) {
    if (path2.charAt(0) === "/") {
      path2 = path2.substring(1);
    }
    if (path2.charAt(path2.length - 1) === "/") {
      path2 = path2.substring(0, path2.length - 1);
    }
    return path2.normalize().split("/");
  }
  parseDump(dump) {
    let inodeCounter = 1n;
    const root = DirectoryNode2.create(void 0, inodeCounter++, dump.name, BigInt(dump.ctime), BigInt(dump.size));
    this.processDirectoryNode(dump, root, inodeCounter);
    return root;
  }
  processDirectoryNode(dump, fs, inodeCounter) {
    for (const entry of Object.values(dump.children)) {
      if (entry.kind === "directory") {
        const child = DirectoryNode2.create(fs, inodeCounter++, entry.name, BigInt(entry.ctime), BigInt(entry.size));
        fs.entries.set(entry.name, child);
        this.processDirectoryNode(entry, child, inodeCounter);
      } else {
        const child = FileNode2.create(fs, inodeCounter++, entry.name, BigInt(entry.ctime), BigInt(entry.size));
        fs.entries.set(entry.name, child);
      }
    }
  }
};
var FileFileDescriptor2 = class _FileFileDescriptor extends BaseFileDescriptor {
  constructor(deviceId, fd11, rights_base, fdflags11, inode6, node) {
    super(deviceId, fd11, Filetype.regular_file, rights_base, 0n, fdflags11, inode6);
    __publicField(this, "_cursor");
    __publicField(this, "node");
    this.node = node;
    this._cursor = 0n;
  }
  with(change) {
    return new _FileFileDescriptor(this.deviceId, change.fd, this.rights_base, this.fdflags, this.inode, this.node);
  }
  get cursor() {
    return this._cursor;
  }
  set cursor(value) {
    if (value < 0) {
      throw new WasiError(Errno.inval);
    }
    this._cursor = value;
  }
};
var DirectoryFileDescriptor2 = class _DirectoryFileDescriptor extends BaseFileDescriptor {
  constructor(deviceId, fd11, rights_base, rights_inheriting, fdflags11, inode6, node) {
    super(deviceId, fd11, Filetype.directory, rights_base, rights_inheriting, fdflags11, inode6);
    __publicField(this, "node");
    this.node = node;
  }
  with(change) {
    return new _DirectoryFileDescriptor(this.deviceId, change.fd, this.rights_base, this.rights_inheriting, this.fdflags, this.inode, this.node);
  }
  childDirectoryRights(requested_rights) {
    return this.rights_inheriting & requested_rights & ~FileOnlyBaseRights2;
  }
  childFileRights(requested_rights) {
    return this.rights_inheriting & requested_rights & ~DirectoryOnlyBaseRights2;
  }
};
function create3(deviceId, baseUri, dump) {
  const $fs = new FileSystem2(baseUri, dump);
  function assertFileDescriptor(fileDescriptor) {
    if (!(fileDescriptor instanceof FileFileDescriptor2)) {
      throw new WasiError(Errno.badf);
    }
  }
  function assertDirectoryDescriptor(fileDescriptor) {
    if (!(fileDescriptor instanceof DirectoryFileDescriptor2)) {
      throw new WasiError(Errno.badf);
    }
  }
  function assertDescriptor(fileDescriptor) {
    if (!(fileDescriptor instanceof FileFileDescriptor2) && !(fileDescriptor instanceof DirectoryFileDescriptor2)) {
      throw new WasiError(Errno.badf);
    }
  }
  function assignStat(result, node) {
    result.dev = deviceId;
    result.ino = node.inode;
    result.filetype = node.kind === 0 /* File */ ? Filetype.regular_file : Filetype.directory;
    result.nlink = 1n;
    result.size = node.size;
    result.atim = node.time;
    result.ctim = node.time;
    result.mtim = node.time;
  }
  function read(content, offset, buffers) {
    let totalBytesRead = 0;
    for (const buffer of buffers) {
      const toRead = Math.min(buffer.length, content.byteLength - offset);
      buffer.set(content.subarray(offset, offset + toRead));
      totalBytesRead += toRead;
      if (toRead < buffer.length) {
        break;
      }
      offset += toRead;
    }
    return totalBytesRead;
  }
  const $driver = {
    kind: "fileSystem" /* fileSystem */,
    uri: baseUri,
    id: deviceId,
    joinPath(...pathSegments) {
      return import_vscode3.Uri.joinPath(baseUri, ...pathSegments);
    },
    createStdioFileDescriptor(_dirflags = Lookupflags.none, _path, _oflags = Oflags.none, _fs_rights_base, _fdflags = Fdflags.none, _fd) {
      throw new WasiError(Errno.nosys);
    },
    fd_create_prestat_fd(fd11) {
      const root = $fs.getRoot();
      $fs.refNode(root);
      return Promise.resolve(new DirectoryFileDescriptor2(deviceId, fd11, DirectoryBaseRights, DirectoryInheritingRights, Fdflags.none, root.inode, root));
    },
    fd_advise(fileDescriptor, _offset, _length, _advise) {
      assertFileDescriptor(fileDescriptor);
      return Promise.resolve();
    },
    fd_close(fileDescriptor) {
      assertDescriptor(fileDescriptor);
      $fs.unrefNode(fileDescriptor.node);
      return Promise.resolve();
    },
    fd_fdstat_get(fileDescriptor, result) {
      result.fs_filetype = fileDescriptor.fileType;
      result.fs_flags = fileDescriptor.fdflags;
      result.fs_rights_base = fileDescriptor.rights_base;
      result.fs_rights_inheriting = fileDescriptor.rights_inheriting;
      return Promise.resolve();
    },
    fd_filestat_get(fileDescriptor, result) {
      assertFileDescriptor(fileDescriptor);
      assignStat(result, fileDescriptor.node);
      return Promise.resolve();
    },
    async fd_pread(fileDescriptor, _offset, buffers) {
      if (buffers.length === 0) {
        return 0;
      }
      assertFileDescriptor(fileDescriptor);
      const offset = BigInts.asNumber(_offset);
      const content = await $fs.getContent(fileDescriptor.node);
      return read(content, offset, buffers);
    },
    async fd_read(fileDescriptor, buffers) {
      if (buffers.length === 0) {
        return 0;
      }
      assertFileDescriptor(fileDescriptor);
      const content = await $fs.getContent(fileDescriptor.node);
      const offset = fileDescriptor.cursor;
      const totalBytesRead = read(content, BigInts.asNumber(offset), buffers);
      fileDescriptor.cursor = fileDescriptor.cursor + BigInt(totalBytesRead);
      return totalBytesRead;
    },
    fd_readdir(fileDescriptor) {
      assertDirectoryDescriptor(fileDescriptor);
      const result = [];
      for (const entry of fileDescriptor.node.entries.values()) {
        result.push({ d_ino: entry.inode, d_type: entry.kind === 0 /* File */ ? Filetype.regular_file : Filetype.directory, d_name: entry.name });
      }
      return Promise.resolve(result);
    },
    async fd_seek(fileDescriptor, offset, whence3) {
      assertFileDescriptor(fileDescriptor);
      switch (whence3) {
        case Whence.set:
          fileDescriptor.cursor = offset;
          break;
        case Whence.cur:
          fileDescriptor.cursor = fileDescriptor.cursor + offset;
          break;
        case Whence.end:
          const size = fileDescriptor.node.size;
          fileDescriptor.cursor = BigInts.max(0n, size - offset);
          break;
      }
      return BigInt(fileDescriptor.cursor);
    },
    fd_renumber(fileDescriptor, _to) {
      assertDescriptor(fileDescriptor);
      return Promise.resolve();
    },
    fd_tell(fileDescriptor) {
      assertFileDescriptor(fileDescriptor);
      return Promise.resolve(fileDescriptor.cursor);
    },
    async path_filestat_get(fileDescriptor, _flags, path2, result) {
      assertDirectoryDescriptor(fileDescriptor);
      const target = $fs.findNode(fileDescriptor.node, path2);
      if (target === void 0) {
        throw new WasiError(Errno.noent);
      }
      assignStat(result, target);
    },
    path_open(fileDescriptor, _dirflags, path2, oflags8, fs_rights_base, fs_rights_inheriting, fdflags11, fdProvider) {
      assertDirectoryDescriptor(fileDescriptor);
      const target = $fs.findNode(fileDescriptor.node, path2);
      if (target === void 0) {
        if (Oflags.creatOn(oflags8)) {
          throw new WasiError(Errno.perm);
        }
        throw new WasiError(Errno.noent);
      }
      if (target.kind !== 1 /* Directory */ && Oflags.directoryOn(oflags8)) {
        throw new WasiError(Errno.notdir);
      }
      if (Oflags.exclOn(oflags8)) {
        throw new WasiError(Errno.exist);
      }
      if (Oflags.truncOn(oflags8) || Fdflags.appendOn(fdflags11) || Fdflags.syncOn(fdflags11)) {
        throw new WasiError(Errno.perm);
      }
      const write = (fs_rights_base & (Rights.fd_write | Rights.fd_datasync | Rights.fd_allocate | Rights.fd_filestat_set_size)) !== 0n;
      if (write) {
        throw new WasiError(Errno.perm);
      }
      const result = target.kind === 1 /* Directory */ ? new DirectoryFileDescriptor2(deviceId, fdProvider.next(), fileDescriptor.childDirectoryRights(fs_rights_base), fs_rights_inheriting | DirectoryInheritingRights, fdflags11, target.inode, target) : new FileFileDescriptor2(deviceId, fdProvider.next(), fileDescriptor.childFileRights(fs_rights_base), fdflags11, target.inode, target);
      $fs.refNode(target);
      return Promise.resolve(result);
    },
    path_readlink(fileDescriptor, path2) {
      assertDirectoryDescriptor(fileDescriptor);
      const target = $fs.findNode(fileDescriptor.node, path2);
      if (target === void 0) {
        throw new WasiError(Errno.noent);
      }
      throw new WasiError(Errno.nolink);
    },
    fd_bytesAvailable(fileDescriptor) {
      assertFileDescriptor(fileDescriptor);
      return Promise.resolve(BigInts.max(0n, fileDescriptor.node.size - fileDescriptor.cursor));
    }
  };
  return Object.assign({}, NoSysDeviceDriver, $driver, WritePermDeniedDeviceDriver);
}

// node_modules/uuid/dist/esm-node/rng.js
var import_crypto = __toESM(require("crypto"));
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    import_crypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

// node_modules/uuid/dist/esm-node/native.js
var import_crypto2 = __toESM(require("crypto"));
var native_default = {
  randomUUID: import_crypto2.default.randomUUID
};

// node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/common/memoryFileSystemDriver.ts
var import_vscode5 = require("vscode");

// src/common/streams.ts
var import_vscode4 = require("vscode");
var DestroyError = class extends Error {
  constructor() {
    super("Pipe got destroyed");
  }
};
var _Stream = class _Stream {
  constructor() {
    __publicField(this, "chunks");
    __publicField(this, "fillLevel");
    __publicField(this, "awaitForFillLevel");
    __publicField(this, "awaitForData");
    this.chunks = [];
    this.fillLevel = 0;
    this.awaitForFillLevel = [];
    this.awaitForData = [];
  }
  get size() {
    return this.fillLevel;
  }
  async write(chunk) {
    if (this.fillLevel + chunk.byteLength <= _Stream.BufferSize) {
      this.chunks.push(chunk);
      this.fillLevel += chunk.byteLength;
      this.signalData();
      return;
    }
    const targetFillLevel = Math.max(0, _Stream.BufferSize - chunk.byteLength);
    try {
      await this.awaitFillLevel(targetFillLevel);
      if (this.fillLevel > targetFillLevel) {
        throw new Error(`Invalid state: fillLevel should be <= ${targetFillLevel}`);
      }
      this.chunks.push(chunk);
      this.fillLevel += chunk.byteLength;
      this.signalData();
      return;
    } catch (error) {
      if (error instanceof DestroyError) {
        return;
      }
      throw error;
    }
  }
  async read(mode, size) {
    const maxBytes = mode === "max" ? size : void 0;
    if (this.chunks.length === 0) {
      try {
        await this.awaitData();
      } catch (error) {
        if (error instanceof DestroyError) {
          return new Uint8Array(0);
        }
        throw error;
      }
    }
    if (this.chunks.length === 0) {
      throw new Error("Invalid state: no bytes available after awaiting data");
    }
    if (maxBytes === void 0 || maxBytes > this.fillLevel) {
      const result = new Uint8Array(this.fillLevel);
      let offset = 0;
      for (const chunk2 of this.chunks) {
        result.set(chunk2, offset);
        offset += chunk2.byteLength;
      }
      this.chunks = [];
      this.fillLevel = 0;
      this.signalSpace();
      return result;
    }
    const chunk = this.chunks[0];
    if (chunk.byteLength > maxBytes) {
      const result = chunk.subarray(0, maxBytes);
      this.chunks[0] = chunk.subarray(maxBytes);
      this.fillLevel -= maxBytes;
      this.signalSpace();
      return result;
    } else {
      let resultSize = chunk.byteLength;
      for (let i = 1; i < this.chunks.length; i++) {
        if (resultSize + this.chunks[i].byteLength > maxBytes) {
          break;
        }
        resultSize += this.chunks[i].byteLength;
      }
      const result = new Uint8Array(resultSize);
      let offset = 0;
      while (offset < resultSize) {
        const chunk2 = this.chunks.shift();
        result.set(chunk2, offset);
        offset += chunk2.byteLength;
        this.fillLevel -= chunk2.byteLength;
      }
      this.signalSpace();
      return result;
    }
  }
  end() {
  }
  destroy() {
    this.chunks = [];
    this.fillLevel = 0;
    const error = new DestroyError();
    for (const { promise } of this.awaitForFillLevel) {
      promise.reject(error);
    }
    this.awaitForFillLevel = [];
    for (const promise of this.awaitForData) {
      promise.reject(error);
    }
    this.awaitForData = [];
  }
  awaitFillLevel(targetFillLevel) {
    if (this.awaitForFillLevel.length === 0 && this.fillLevel <= targetFillLevel) {
      return Promise.resolve();
    }
    const result = CapturedPromise.create();
    this.awaitForFillLevel.push({ fillLevel: targetFillLevel, promise: result });
    return result.promise;
  }
  awaitData() {
    const result = CapturedPromise.create();
    this.awaitForData.push(result);
    return result.promise;
  }
  signalSpace() {
    if (this.awaitForFillLevel.length === 0) {
      return;
    }
    const { fillLevel, promise } = this.awaitForFillLevel[0];
    if (this.fillLevel > fillLevel) {
      return;
    }
    this.awaitForFillLevel.shift();
    promise.resolve();
  }
  signalData() {
    if (this.awaitForData.length === 0) {
      return;
    }
    const promise = this.awaitForData.shift();
    promise.resolve();
  }
};
__publicField(_Stream, "BufferSize", 16384);
var Stream = _Stream;
var WritableStream = class extends Stream {
  constructor(encoding) {
    super();
    __publicField(this, "encoding");
    __publicField(this, "encoder");
    this.encoding = encoding ?? "utf-8";
    this.encoder = ral_default().TextEncoder.create(this.encoding);
  }
  async write(chunk) {
    return super.write(typeof chunk === "string" ? this.encoder.encode(chunk) : chunk);
  }
  end() {
  }
};
var ReadableStream = class extends Stream {
  constructor() {
    super();
    __publicField(this, "mode");
    __publicField(this, "_onData");
    __publicField(this, "_onDataEvent");
    __publicField(this, "timer");
    this.mode = 0 /* initial */;
    this._onData = new import_vscode4.EventEmitter();
    this._onDataEvent = (listener, thisArgs, disposables) => {
      if (this.mode === 0 /* initial */) {
        this.mode = 1 /* flowing */;
      }
      return this._onData.event(listener, thisArgs, disposables);
    };
  }
  get onData() {
    return this._onDataEvent;
  }
  pause(flush = false) {
    if (this.mode === 1 /* flowing */) {
      if (this.timer !== void 0) {
        this.timer.dispose();
        this.timer = void 0;
      }
      if (flush) {
        this.emitAll();
      }
    }
    this.mode = 2 /* paused */;
  }
  resume() {
    this.mode = 1 /* flowing */;
    if (this.chunks.length > 0) {
      this.signalData();
    }
  }
  async read(mode, size) {
    if (this.mode === 1 /* flowing */) {
      throw new Error("Cannot read from stream in flowing mode");
    }
    return mode === void 0 ? super.read() : super.read(mode, size);
  }
  end() {
    if (this.mode === 1 /* flowing */) {
      if (this.timer !== void 0) {
        this.timer.dispose();
        this.timer = void 0;
      }
      this.emitAll();
    }
    return super.destroy();
  }
  signalData() {
    if (this.mode === 1 /* flowing */) {
      if (this.timer !== void 0) {
        return;
      }
      this.timer = ral_default().timer.setImmediate(() => this.triggerData());
    } else {
      super.signalData();
    }
  }
  emitAll() {
    if (this.chunks.length > 0) {
      for (const chunk of this.chunks) {
        try {
          this._onData.fire(chunk);
        } catch (error) {
          ral_default().console.error(`[ReadableStream]: Error while emitting data event: ${error}`);
        }
      }
      this.chunks = [];
      this.fillLevel = 0;
    }
  }
  triggerData() {
    this.timer = void 0;
    if (this.chunks.length === 0) {
      return;
    }
    const chunk = this.chunks.shift();
    this.fillLevel -= chunk.byteLength;
    this._onData.fire(chunk);
    this.signalSpace();
    if (this.chunks.length > 0 && this.mode === 1 /* flowing */) {
      this.timer = ral_default().timer.setImmediate(() => this.triggerData());
    }
  }
};

// src/common/memoryFileSystemDriver.ts
var paths = ral_default().path;
function timeInNanoseconds(timeInMilliseconds) {
  return BigInt(timeInMilliseconds) * 1000000n;
}
var FileNode3;
((FileNode4) => {
  function create8(parent, inode6, name, time, content) {
    return {
      filetype: Filetype.regular_file,
      inode: inode6,
      name,
      ctime: time,
      mtime: time,
      atime: time,
      refs: 0,
      parent,
      content
    };
  }
  FileNode4.create = create8;
  function size(node) {
    if (node.content instanceof Uint8Array) {
      return BigInt(node.content.length);
    } else {
      return node.content.size;
    }
  }
  FileNode4.size = size;
})(FileNode3 || (FileNode3 = {}));
var DirectoryNode3;
((DirectoryNode4) => {
  function create8(parent, id, name, time) {
    return {
      filetype: Filetype.directory,
      inode: id,
      name,
      ctime: time,
      mtime: time,
      atime: time,
      refs: 0,
      parent,
      entries: /* @__PURE__ */ new Map()
    };
  }
  DirectoryNode4.create = create8;
  function size(node) {
    return BigInt((Math.trunc(node.entries.size * 24 / 4096) + 1) * 4096);
  }
  DirectoryNode4.size = size;
})(DirectoryNode3 || (DirectoryNode3 = {}));
var CharacterDeviceNode;
((CharacterDeviceNode2) => {
  function create8(parent, inode6, name, time, readable, writable) {
    return {
      filetype: Filetype.character_device,
      inode: inode6,
      name,
      ctime: time,
      mtime: time,
      atime: time,
      refs: 0,
      parent,
      readable,
      writable
    };
  }
  CharacterDeviceNode2.create = create8;
})(CharacterDeviceNode || (CharacterDeviceNode = {}));
var MemoryFileSystem = class extends BaseFileSystem {
  constructor() {
    super(DirectoryNode3.create(void 0, 1n, "/", timeInNanoseconds(Date.now())));
    __publicField(this, "uri", import_vscode5.Uri.from({ scheme: "wasi-memfs", authority: v4_default() }));
  }
  createDirectory(path2) {
    const dirname = paths.dirname(path2);
    const basename = paths.basename(path2);
    const parent = this.getDirectoryNode(dirname);
    const node = DirectoryNode3.create(parent, this.nextInode(), basename, timeInNanoseconds(Date.now()));
    parent.entries.set(basename, node);
  }
  createFile(path2, content) {
    const dirname = paths.dirname(path2);
    const basename = paths.basename(path2);
    const parent = this.getDirectoryNode(dirname);
    const node = FileNode3.create(parent, this.nextInode(), basename, timeInNanoseconds(Date.now()), content);
    parent.entries.set(basename, node);
  }
  createReadable(path2) {
    const dirname = paths.dirname(path2);
    const basename = paths.basename(path2);
    const parent = this.getDirectoryNode(dirname);
    const node = CharacterDeviceNode.create(parent, this.nextInode(), basename, timeInNanoseconds(Date.now()), new ReadableStream(), void 0);
    parent.entries.set(basename, node);
    return node.readable;
  }
  createWritable(path2, encoding) {
    const dirname = paths.dirname(path2);
    const basename = paths.basename(path2);
    const parent = this.getDirectoryNode(dirname);
    const node = CharacterDeviceNode.create(parent, this.nextInode(), basename, timeInNanoseconds(Date.now()), void 0, new WritableStream(encoding));
    parent.entries.set(basename, node);
    return node.writable;
  }
  getDirectoryNode(path2) {
    const result = this.findNode(path2);
    if (result === void 0) {
      throw new Error(`ENOENT: no such directory ${path2}`);
    }
    if (result.filetype !== Filetype.directory) {
      throw new Error(`ENOTDIR: not a directory ${path2}`);
    }
    return result;
  }
  async readFile(node, offset, buffers) {
    const content = await this.getContent(node);
    return this.read(content, offset, buffers);
  }
  async readCharacterDevice(node, buffers) {
    const maxBytes = buffers.reduce((previousValue, current) => {
      return previousValue + current.byteLength;
    }, 0);
    const content = await node.writable.read("max", maxBytes);
    return this.read(content, 0n, buffers);
  }
  async writeFile(node, offset, buffers) {
    const content = await this.getContent(node);
    const [newContent, bytesWritten] = this.write(content, offset, buffers);
    node.content = newContent;
    return bytesWritten;
  }
  async writeCharacterDevice(node, buffers) {
    const allBytes = buffers.reduce((previousValue, current) => {
      return previousValue + current.byteLength;
    }, 0);
    const buffer = new Uint8Array(allBytes);
    let offset = 0;
    for (const b of buffers) {
      buffer.set(b, offset);
      offset += b.byteLength;
    }
    await node.readable.write(buffer);
    return allBytes;
  }
  async getContent(node) {
    if (node.content instanceof Uint8Array) {
      return Promise.resolve(node.content);
    } else {
      const result = await node.content.reader();
      node.content = result;
      return result;
    }
  }
  read(content, _offset, buffers) {
    let offset = BigInts.asNumber(_offset);
    let totalBytesRead = 0;
    for (const buffer of buffers) {
      const toRead = Math.min(buffer.length, content.byteLength - offset);
      buffer.set(content.subarray(offset, offset + toRead));
      totalBytesRead += toRead;
      if (toRead < buffer.length) {
        break;
      }
      offset += toRead;
    }
    return totalBytesRead;
  }
  write(content, _offset, buffers) {
    let offset = BigInts.asNumber(_offset);
    let bytesToWrite = 0;
    for (const bytes of buffers) {
      bytesToWrite += bytes.byteLength;
    }
    if (offset + bytesToWrite > content.byteLength) {
      const newContent = new Uint8Array(offset + bytesToWrite);
      newContent.set(content);
      content = newContent;
    }
    for (const bytes of buffers) {
      content.set(bytes, offset);
      offset += bytes.length;
    }
    return [content, bytesToWrite];
  }
};
var DirectoryBaseRights2 = Rights.fd_readdir | Rights.path_filestat_get | Rights.fd_filestat_get | Rights.path_open | Rights.path_create_file | Rights.path_create_directory;
var FileBaseRights2 = Rights.fd_read | Rights.fd_seek | Rights.fd_tell | Rights.fd_advise | Rights.fd_filestat_get | Rights.poll_fd_readwrite;
var DirectoryInheritingRights2 = DirectoryBaseRights2 | FileBaseRights2;
var DirectoryOnlyBaseRights3 = DirectoryBaseRights2 & ~FileBaseRights2;
var FileOnlyBaseRights3 = FileBaseRights2 & DirectoryBaseRights2;
function create4(deviceId, memfs) {
  const $fs = memfs;
  function assertFileDescriptor(fileDescriptor) {
    if (!(fileDescriptor instanceof FileNodeDescriptor)) {
      throw new WasiError(Errno.badf);
    }
  }
  function assertReadDescriptor(fileDescriptor) {
    if (!(fileDescriptor instanceof FileNodeDescriptor) && !(fileDescriptor instanceof CharacterDeviceNodeDescriptor)) {
      throw new WasiError(Errno.badf);
    }
    if (fileDescriptor instanceof CharacterDeviceNodeDescriptor && fileDescriptor.node.writable === void 0) {
      throw new WasiError(Errno.perm);
    }
  }
  function assertWriteDescriptor(fileDescriptor) {
    if (!(fileDescriptor instanceof FileNodeDescriptor) && !(fileDescriptor instanceof CharacterDeviceNodeDescriptor)) {
      throw new WasiError(Errno.badf);
    }
    if (fileDescriptor instanceof CharacterDeviceNodeDescriptor && fileDescriptor.node.readable === void 0) {
      throw new WasiError(Errno.perm);
    }
  }
  function assertDirectoryDescriptor(fileDescriptor) {
    if (!(fileDescriptor instanceof DirectoryNodeDescriptor)) {
      throw new WasiError(Errno.badf);
    }
  }
  function assertDescriptor(fileDescriptor) {
    if (!(fileDescriptor instanceof FileNodeDescriptor) && !(fileDescriptor instanceof DirectoryNodeDescriptor) && !(fileDescriptor instanceof CharacterDeviceNodeDescriptor)) {
      throw new WasiError(Errno.badf);
    }
  }
  function getSize(node) {
    switch (node.filetype) {
      case Filetype.regular_file:
        return FileNode3.size(node);
      case Filetype.directory:
        return DirectoryNode3.size(node);
      case Filetype.character_device:
        return 1n;
    }
  }
  function assignStat(result, node) {
    result.dev = deviceId;
    result.ino = node.inode;
    result.filetype = node.filetype;
    result.nlink = 1n;
    result.size = getSize(node);
    result.atim = node.atime;
    result.ctim = node.ctime;
    result.mtim = node.mtime;
  }
  const $driver = {
    kind: "fileSystem" /* fileSystem */,
    uri: $fs.uri,
    id: deviceId,
    joinPath() {
      return void 0;
    },
    createStdioFileDescriptor(_dirflags = Lookupflags.none, _path, _oflags = Oflags.none, _fs_rights_base, _fdflags = Fdflags.none, _fd) {
      throw new WasiError(Errno.nosys);
    },
    fd_create_prestat_fd(fd11) {
      const root = $fs.getRoot();
      return Promise.resolve(new DirectoryNodeDescriptor(deviceId, fd11, DirectoryBaseRights2, DirectoryInheritingRights2, Fdflags.none, root.inode, root));
    },
    fd_advise(fileDescriptor, _offset, _length, _advise) {
      assertFileDescriptor(fileDescriptor);
      return Promise.resolve();
    },
    fd_close(fileDescriptor) {
      assertDescriptor(fileDescriptor);
      return Promise.resolve();
    },
    fd_fdstat_get(fileDescriptor, result) {
      result.fs_filetype = fileDescriptor.fileType;
      result.fs_flags = fileDescriptor.fdflags;
      result.fs_rights_base = fileDescriptor.rights_base;
      result.fs_rights_inheriting = fileDescriptor.rights_inheriting;
      return Promise.resolve();
    },
    fd_filestat_get(fileDescriptor, result) {
      assertFileDescriptor(fileDescriptor);
      assignStat(result, fileDescriptor.node);
      return Promise.resolve();
    },
    async fd_pread(fileDescriptor, offset, buffers) {
      if (buffers.length === 0) {
        return 0;
      }
      assertReadDescriptor(fileDescriptor);
      if (fileDescriptor instanceof FileNodeDescriptor) {
        return $fs.readFile(fileDescriptor.node, offset, buffers);
      } else {
        return $fs.readCharacterDevice(fileDescriptor.node, buffers);
      }
    },
    async fd_read(fileDescriptor, buffers) {
      if (buffers.length === 0) {
        return 0;
      }
      assertReadDescriptor(fileDescriptor);
      let totalBytesRead = 0;
      if (fileDescriptor instanceof FileNodeDescriptor) {
        totalBytesRead = await $fs.readFile(fileDescriptor.node, fileDescriptor.cursor, buffers);
        fileDescriptor.cursor = fileDescriptor.cursor + BigInt(totalBytesRead);
      } else {
        totalBytesRead = await $fs.readCharacterDevice(fileDescriptor.node, buffers);
      }
      return totalBytesRead;
    },
    fd_readdir(fileDescriptor) {
      assertDirectoryDescriptor(fileDescriptor);
      const result = [];
      for (const entry of fileDescriptor.node.entries.values()) {
        result.push({ d_ino: entry.inode, d_type: entry.filetype, d_name: entry.name });
      }
      return Promise.resolve(result);
    },
    async fd_seek(fileDescriptor, offset, whence3) {
      assertFileDescriptor(fileDescriptor);
      switch (whence3) {
        case Whence.set:
          fileDescriptor.cursor = offset;
          break;
        case Whence.cur:
          fileDescriptor.cursor = fileDescriptor.cursor + offset;
          break;
        case Whence.end:
          const size = FileNode3.size(fileDescriptor.node);
          fileDescriptor.cursor = BigInts.max(0n, size - offset);
          break;
      }
      return BigInt(fileDescriptor.cursor);
    },
    fd_renumber(fileDescriptor, _to) {
      assertDescriptor(fileDescriptor);
      return Promise.resolve();
    },
    fd_tell(fileDescriptor) {
      assertFileDescriptor(fileDescriptor);
      return Promise.resolve(fileDescriptor.cursor);
    },
    async fd_pwrite(fileDescriptor, offset, buffers) {
      assertWriteDescriptor(fileDescriptor);
      let bytesWritten = 0;
      if (fileDescriptor instanceof FileNodeDescriptor) {
        bytesWritten = await $fs.writeFile(fileDescriptor.node, offset, buffers);
      } else {
        bytesWritten = await $fs.writeCharacterDevice(fileDescriptor.node, buffers);
      }
      return bytesWritten;
    },
    async fd_write(fileDescriptor, buffers) {
      assertWriteDescriptor(fileDescriptor);
      let bytesWritten = 0;
      if (fileDescriptor instanceof FileNodeDescriptor) {
        if (Fdflags.appendOn(fileDescriptor.fdflags)) {
          fileDescriptor.cursor = BigInt((await $fs.getContent(fileDescriptor.node)).byteLength);
        }
        bytesWritten = await $fs.writeFile(fileDescriptor.node, fileDescriptor.cursor, buffers);
        fileDescriptor.cursor = fileDescriptor.cursor + BigInt(bytesWritten);
      } else {
        bytesWritten = await $fs.writeCharacterDevice(fileDescriptor.node, buffers);
      }
      return bytesWritten;
    },
    async path_filestat_get(fileDescriptor, _flags, path2, result) {
      assertDirectoryDescriptor(fileDescriptor);
      const target = $fs.findNode(fileDescriptor.node, path2);
      if (target === void 0) {
        throw new WasiError(Errno.noent);
      }
      assignStat(result, target);
    },
    path_open(fileDescriptor, _dirflags, path2, oflags8, fs_rights_base, fs_rights_inheriting, fdflags11, fdProvider) {
      assertDirectoryDescriptor(fileDescriptor);
      const target = $fs.findNode(fileDescriptor.node, path2);
      if (target === void 0) {
        if (Oflags.creatOn(oflags8)) {
          throw new WasiError(Errno.perm);
        }
        throw new WasiError(Errno.noent);
      }
      if (target.filetype !== Filetype.directory && Oflags.directoryOn(oflags8)) {
        throw new WasiError(Errno.notdir);
      }
      if (Oflags.exclOn(oflags8)) {
        throw new WasiError(Errno.exist);
      }
      if (target.filetype === Filetype.regular_file && (Oflags.truncOn(oflags8) || Fdflags.appendOn(fdflags11) || Fdflags.syncOn(fdflags11))) {
        throw new WasiError(Errno.perm);
      }
      const write = (fs_rights_base & (Rights.fd_write | Rights.fd_datasync | Rights.fd_allocate | Rights.fd_filestat_set_size)) !== 0n;
      if (target.filetype === Filetype.regular_file && write) {
        throw new WasiError(Errno.perm);
      }
      let descriptor;
      switch (target.filetype) {
        case Filetype.regular_file:
          descriptor = new FileNodeDescriptor(deviceId, fdProvider.next(), fileDescriptor.childFileRights(fs_rights_base, DirectoryOnlyBaseRights3), fdflags11, target.inode, target);
          break;
        case Filetype.directory:
          descriptor = new DirectoryNodeDescriptor(deviceId, fdProvider.next(), fileDescriptor.childDirectoryRights(fs_rights_base, FileOnlyBaseRights3), fs_rights_inheriting | DirectoryInheritingRights2, fdflags11, target.inode, target);
          break;
        case Filetype.character_device:
          let rights12 = fileDescriptor.childFileRights(fs_rights_base, FileOnlyBaseRights3) | Rights.fd_write;
          descriptor = new CharacterDeviceNodeDescriptor(deviceId, fdProvider.next(), rights12, fdflags11, target.inode, target);
          break;
      }
      if (descriptor === void 0) {
        throw new WasiError(Errno.noent);
      }
      return Promise.resolve(descriptor);
    },
    path_readlink(fileDescriptor, path2) {
      assertDirectoryDescriptor(fileDescriptor);
      const target = $fs.findNode(fileDescriptor.node, path2);
      if (target === void 0) {
        throw new WasiError(Errno.noent);
      }
      throw new WasiError(Errno.nolink);
    },
    fd_bytesAvailable(fileDescriptor) {
      assertFileDescriptor(fileDescriptor);
      return Promise.resolve(BigInts.max(0n, FileNode3.size(fileDescriptor.node) - fileDescriptor.cursor));
    }
  };
  return Object.assign({}, NoSysDeviceDriver, WritePermDeniedDeviceDriver, $driver);
}

// src/common/rootFileSystemDriver.ts
var import_vscode6 = require("vscode");
var DirectoryBaseRights3 = Rights.fd_fdstat_set_flags | Rights.path_create_directory | Rights.path_create_file | Rights.path_link_source | Rights.path_link_target | Rights.path_open | Rights.fd_readdir | Rights.path_readlink | Rights.path_rename_source | Rights.path_rename_target | Rights.path_filestat_get | Rights.path_filestat_set_size | Rights.path_filestat_set_times | Rights.fd_filestat_get | Rights.fd_filestat_set_times | Rights.path_remove_directory | Rights.path_unlink_file | Rights.path_symlink;
var FileBaseRights3 = Rights.fd_datasync | Rights.fd_read | Rights.fd_seek | Rights.fd_fdstat_set_flags | Rights.fd_sync | Rights.fd_tell | Rights.fd_write | Rights.fd_advise | Rights.fd_allocate | Rights.fd_filestat_get | Rights.fd_filestat_set_size | Rights.fd_filestat_set_times | Rights.poll_fd_readwrite;
var DirectoryInheritingRights3 = DirectoryBaseRights3 | FileBaseRights3;
var DirectoryFileDescriptor3 = class _DirectoryFileDescriptor extends BaseFileDescriptor {
  constructor(deviceId, fd11, rights_base, rights_inheriting, fdflags11, inode6) {
    super(deviceId, fd11, Filetype.directory, rights_base, rights_inheriting, fdflags11, inode6);
  }
  with(change) {
    return new _DirectoryFileDescriptor(this.deviceId, change.fd, this.rights_base, this.rights_inheriting, this.fdflags, this.inode);
  }
};
var VirtualDirectoryNode;
((VirtualDirectoryNode2) => {
  function create8(id, parent, name) {
    return {
      kind: 0 /* VirtualDirectory */,
      inode: id,
      parent,
      name,
      entries: /* @__PURE__ */ new Map()
    };
  }
  VirtualDirectoryNode2.create = create8;
})(VirtualDirectoryNode || (VirtualDirectoryNode = {}));
var MountPointNode;
((MountPointNode2) => {
  function create8(id, parent, name, deviceDriver) {
    return {
      kind: 1 /* MountPoint */,
      inode: id,
      parent,
      name,
      deviceDriver
    };
  }
  MountPointNode2.create = create8;
})(MountPointNode || (MountPointNode = {}));
var _VirtualRootFileSystem = class _VirtualRootFileSystem {
  constructor(deviceId) {
    __publicField(this, "deviceId");
    __publicField(this, "inodes");
    __publicField(this, "root");
    __publicField(this, "deviceDrivers");
    __publicField(this, "mountPoints");
    this.deviceId = deviceId;
    this.inodes = /* @__PURE__ */ new Map();
    this.root = VirtualDirectoryNode.create(_VirtualRootFileSystem.inodeCounter++, void 0, "/");
    this.inodes.set(this.root.inode, this.root);
    this.deviceDrivers = /* @__PURE__ */ new Map();
    this.mountPoints = /* @__PURE__ */ new Map();
  }
  isRoot(node) {
    return node.inode === this.root.inode;
  }
  addMountPoint(filepath, deviceDriver) {
    if (filepath.length === 0) {
      throw new Error("Cannot mount root");
    }
    const path2 = ral_default().path;
    if (filepath.charAt(0) !== path2.sep) {
      throw new Error(`Cannot mount relative path: ${filepath}`);
    }
    const segments = filepath.split(path2.sep);
    segments.shift();
    let current = this.root;
    for (let i = 0; i < segments.length; i++) {
      if (current.kind === 1 /* MountPoint */) {
        throw new Error(`Cannot create virtual folder over mount point: ${path2.sep}${segments.slice(0, i + 1).join(path2.sep)}`);
      }
      const segment = segments[i];
      if (i === segments.length - 1) {
        const child = MountPointNode.create(_VirtualRootFileSystem.inodeCounter++, current, segment, deviceDriver);
        this.inodes.set(child.inode, child);
        current.entries.set(segment, child);
        this.deviceDrivers.set(deviceDriver, child);
        this.mountPoints.set(filepath, child);
      } else {
        let child = current.entries.get(segment);
        if (child === void 0) {
          child = VirtualDirectoryNode.create(_VirtualRootFileSystem.inodeCounter++, current, segment);
          current.entries.set(segment, child);
          this.inodes.set(child.inode, child);
        }
        current = child;
      }
    }
  }
  getNode(inode6) {
    const node = this.inodes.get(inode6);
    if (node === void 0) {
      throw new WasiError(Errno.badf);
    }
    return node;
  }
  findNode(parentNode, filePath) {
    const path2 = ral_default().path;
    filePath = path2.normalize(filePath);
    if (filePath === "/") {
      return [this.root, filePath];
    } else if (filePath === ".") {
      return parentNode.kind === 0 /* VirtualDirectory */ ? [parentNode, void 0] : [parentNode, filePath];
    } else if (filePath === "..") {
      if (parentNode.parent === void 0) {
        return [this.root, void 0];
      } else {
        return [parentNode.parent, void 0];
      }
    }
    const segments = filePath.split(path2.sep);
    if (segments[0] === "") {
      if (parentNode !== this.root) {
        throw new WasiError(Errno.noent);
      }
      segments.shift();
    }
    let current = parentNode;
    for (let i = 0; i < segments.length; i++) {
      if (current.kind === 1 /* MountPoint */) {
        return [current, path2.join(...segments.slice(i))];
      }
      const segment = segments[i];
      const child = current.entries.get(segment);
      if (child === void 0) {
        throw new WasiError(Errno.noent);
      } else if (i === segments.length - 1) {
        return child.kind === 0 /* VirtualDirectory */ ? [child, void 0] : [child, "."];
      }
      current = child;
    }
    throw new WasiError(Errno.noent);
  }
  makeVirtualPath(deviceDriver, filepath) {
    const node = this.deviceDrivers.get(deviceDriver);
    if (node === void 0) {
      return void 0;
    }
    const nodePath = this.getPath(node);
    return ral_default().path.join(nodePath, filepath);
  }
  getDeviceDriver(path2) {
    const [node, relativePath] = this.findNode(this.root, path2);
    if (node.kind === 1 /* MountPoint */) {
      return [node.deviceDriver, relativePath];
    } else {
      return [void 0, path2];
    }
  }
  getMountPoint(uri2) {
    const uriStr = uri2.toString();
    for (const [mountPoint, node] of this.mountPoints) {
      const root = node.deviceDriver.uri;
      const rootStr = root.toString();
      if (uriStr === rootStr || uriStr.startsWith(rootStr) && (rootStr.charAt(rootStr.length - 1) === "/" || uriStr.charAt(rootStr.length) === "/")) {
        return [mountPoint, root];
      }
    }
    return [void 0, uri2];
  }
  getPath(inode6) {
    const parts = [];
    let current = inode6;
    do {
      parts.push(current.name);
      current = current.parent;
    } while (current !== void 0);
    return ral_default().path.join(...parts.reverse());
  }
};
__publicField(_VirtualRootFileSystem, "inodeCounter", 1n);
var VirtualRootFileSystem = _VirtualRootFileSystem;
function create5(deviceId, rootFileDescriptors, mountPoints) {
  let $atim = BigInt(Date.now()) * 1000000n;
  let $mtim = $atim;
  let $ctim = $atim;
  function assertDirectoryDescriptor(fileDescriptor) {
    if (fileDescriptor.fileType !== Filetype.directory) {
      throw new WasiError(Errno.badf);
    }
  }
  function createFileDescriptor(fd11, inode6) {
    return new DirectoryFileDescriptor3(deviceId, fd11, DirectoryBaseRights3, DirectoryInheritingRights3, 0, inode6);
  }
  function createRootFileDescriptor(fd11) {
    return createFileDescriptor(fd11, $fs.root.inode);
  }
  const $fs = new VirtualRootFileSystem(deviceId);
  for (const [filepath, driver] of mountPoints) {
    $fs.addMountPoint(filepath, driver);
  }
  const $driver = {
    kind: "fileSystem" /* fileSystem */,
    id: deviceId,
    uri: import_vscode6.Uri.from({ scheme: "wasi-root", path: "/" }),
    makeVirtualPath(deviceDriver, filepath) {
      return $fs.makeVirtualPath(deviceDriver, filepath);
    },
    getDeviceDriver(path2) {
      return $fs.getDeviceDriver(path2);
    },
    getMountPoint(uri2) {
      return $fs.getMountPoint(uri2);
    },
    joinPath() {
      return void 0;
    },
    createStdioFileDescriptor() {
      throw new Error(`Virtual root FS can't provide stdio file descriptors`);
    },
    fd_create_prestat_fd(fd11) {
      return Promise.resolve(createRootFileDescriptor(fd11));
    },
    fd_close(_fileDescriptor) {
      return Promise.resolve();
    },
    fd_fdstat_get(fileDescriptor, result) {
      result.fs_filetype = fileDescriptor.fileType;
      result.fs_flags = fileDescriptor.fdflags;
      result.fs_rights_base = fileDescriptor.rights_base;
      result.fs_rights_inheriting = fileDescriptor.rights_inheriting;
      return Promise.resolve();
    },
    fd_fdstat_set_flags(fileDescriptor, fdflags11) {
      fileDescriptor.fdflags = fdflags11;
      return Promise.resolve();
    },
    fd_filestat_get(fileDescriptor, result) {
      assertDirectoryDescriptor(fileDescriptor);
      const node = $fs.getNode(fileDescriptor.inode);
      if (node.kind === 1 /* MountPoint */) {
        throw new WasiError(Errno.badf);
      }
      result.dev = fileDescriptor.deviceId;
      result.ino = fileDescriptor.inode;
      result.filetype = fileDescriptor.fileType;
      result.nlink = 1n;
      result.size = BigInt(node.entries.size);
      result.atim = $atim;
      result.mtim = $mtim;
      result.ctim = $ctim;
      return Promise.resolve();
    },
    fd_filestat_set_times(_fileDescriptor, atim, mtim, _fst_flags) {
      $atim = atim;
      $mtim = mtim;
      return Promise.resolve();
    },
    async fd_readdir(fileDescriptor) {
      assertDirectoryDescriptor(fileDescriptor);
      const result = [];
      const node = $fs.getNode(fileDescriptor.inode);
      if (node.kind === 1 /* MountPoint */) {
        throw new WasiError(Errno.badf);
      }
      for (const child of node.entries.values()) {
        result.push({ d_name: child.name, d_type: Filetype.directory, d_ino: child.inode });
      }
      return result;
    },
    async path_filestat_get(fileDescriptor, flags, path2, result) {
      assertDirectoryDescriptor(fileDescriptor);
      const parentNode = $fs.getNode(fileDescriptor.inode);
      if ($fs.isRoot(parentNode) && (path2 === "." || path2 === ".." || path2 === "/")) {
        return this.fd_filestat_get(rootFileDescriptors.getRoot($this), result);
      }
      const [node, pathRemainder] = $fs.findNode(parentNode, path2);
      if (node.kind === 1 /* MountPoint */) {
        const driver = node.deviceDriver;
        const rootFileDescriptor = rootFileDescriptors.getRoot(driver);
        if (rootFileDescriptor === void 0) {
          throw new WasiError(Errno.badf);
        }
        return driver.path_filestat_get(rootFileDescriptor, flags, pathRemainder, result);
      }
      result.dev = fileDescriptor.deviceId;
      result.ino = node.inode;
      result.filetype = Filetype.directory;
      result.nlink = 1n;
      result.size = BigInt(node.entries.size);
      result.atim = $atim;
      result.mtim = $mtim;
      result.ctim = $ctim;
      return Promise.resolve();
    },
    async path_open(parentDescriptor, dirflags, path2, oflags8, fs_rights_base, fs_rights_inheriting, fdflags11, fdProvider) {
      assertDirectoryDescriptor(parentDescriptor);
      const parentNode = $fs.getNode(parentDescriptor.inode);
      const [node, pathRemainder] = $fs.findNode(parentNode, path2);
      if (node.kind === 1 /* MountPoint */) {
        const driver = node.deviceDriver;
        const rootFileDescriptor = rootFileDescriptors.getRoot(driver);
        if (rootFileDescriptor === void 0) {
          throw new WasiError(Errno.noent);
        }
        return driver.path_open(rootFileDescriptor, dirflags, pathRemainder, oflags8, fs_rights_base, fs_rights_inheriting, fdflags11, fdProvider);
      }
      return createFileDescriptor(fdProvider.next(), node.inode);
    }
  };
  const $this = Object.assign({}, NoSysDeviceDriver, $driver, WritePermDeniedDeviceDriver);
  return $this;
}

// src/common/kernel.ts
var DeviceDriversImpl = class {
  constructor() {
    __publicField(this, "devices");
    __publicField(this, "devicesByUri");
    this.devices = /* @__PURE__ */ new Map();
    this.devicesByUri = /* @__PURE__ */ new Map();
  }
  add(driver) {
    this.devices.set(driver.id, driver);
    this.devicesByUri.set(driver.uri.toString(true), driver);
  }
  has(id) {
    return this.devices.has(id);
  }
  hasByUri(uri2) {
    return this.devicesByUri.has(uri2.toString(true));
  }
  get(id) {
    const driver = this.devices.get(id);
    if (driver === void 0) {
      throw new WasiError(Errno.nxio);
    }
    return driver;
  }
  getByUri(uri2) {
    const driver = this.devicesByUri.get(uri2.toString(true));
    if (driver === void 0) {
      throw new WasiError(Errno.nxio);
    }
    return driver;
  }
  remove(id) {
    const driver = this.devices.get(id);
    if (driver === void 0) {
      throw new WasiError(Errno.nxio);
    }
    this.devices.delete(id);
    this.devicesByUri.delete(driver.uri.toString(true));
  }
  removeByUri(uri2) {
    const key = uri2.toString(true);
    const driver = this.devicesByUri.get(key);
    if (driver === void 0) {
      throw new WasiError(Errno.nxio);
    }
    this.devices.delete(driver.id);
    this.devicesByUri.delete(key);
  }
  get size() {
    return this.devices.size;
  }
  values() {
    return this.devices.values();
  }
  entries() {
    return this.devices.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
};
var LocalDeviceDrivers = class {
  constructor(next) {
    __publicField(this, "nextDrivers");
    __publicField(this, "devices");
    __publicField(this, "devicesByUri");
    this.nextDrivers = next;
    this.devices = /* @__PURE__ */ new Map();
    this.devicesByUri = /* @__PURE__ */ new Map();
  }
  add(driver) {
    this.devices.set(driver.id, driver);
    this.devicesByUri.set(driver.uri.toString(true), driver);
  }
  has(id) {
    if (this.nextDrivers.has(id)) {
      return true;
    }
    return this.devices.has(id);
  }
  hasByUri(uri2) {
    if (this.nextDrivers.hasByUri(uri2)) {
      return true;
    }
    return this.devicesByUri.has(uri2.toString(true));
  }
  get(id) {
    const result = this.devices.get(id);
    if (result !== void 0) {
      return result;
    }
    return this.nextDrivers.get(id);
  }
  getByUri(uri2) {
    const result = this.devicesByUri.get(uri2.toString(true));
    if (result !== void 0) {
      return result;
    }
    return this.nextDrivers.getByUri(uri2);
  }
  remove(id) {
    const driver = this.devices.get(id);
    if (driver !== void 0) {
      this.devices.delete(id);
      this.devicesByUri.delete(driver.uri.toString(true));
      return;
    }
    this.nextDrivers.remove(id);
  }
  removeByUri(uri2) {
    const key = uri2.toString(true);
    const driver = this.devicesByUri.get(key);
    if (driver !== void 0) {
      this.devices.delete(driver.id);
      this.devicesByUri.delete(key);
      return;
    }
    this.nextDrivers.removeByUri(uri2);
  }
  get size() {
    return this.devices.size + this.nextDrivers.size;
  }
  entries() {
    let local = this.devices.entries();
    const next = this.nextDrivers.entries();
    const iterator = {
      [Symbol.iterator]: () => {
        return iterator;
      },
      next: () => {
        if (local !== void 0) {
          const result = local.next();
          if (!result.done) {
            return result;
          }
          local = void 0;
        }
        return next.next();
      }
    };
    return iterator;
  }
  values() {
    let local = this.devices.values();
    const next = this.nextDrivers.values();
    const iterator = {
      [Symbol.iterator]: () => {
        return iterator;
      },
      next: () => {
        if (local !== void 0) {
          const result = local.next();
          if (!result.done) {
            return result;
          }
          local = void 0;
        }
        return next.next();
      }
    };
    return iterator;
  }
  [Symbol.iterator]() {
    return this.entries();
  }
};
var ExtensionDataFileSystem;
((ExtensionDataFileSystem2) => {
  function is(value) {
    const candidate = value;
    return candidate && candidate.kind === "extensionData" && typeof candidate.id === "string" && typeof candidate.path === "string" && typeof candidate.mountPoint === "string";
  }
  ExtensionDataFileSystem2.is = is;
})(ExtensionDataFileSystem || (ExtensionDataFileSystem = {}));
var FileSystem3;
((FileSystem4) => {
  function is(value) {
    return ExtensionDataFileSystem.is(value);
  }
  FileSystem4.is = is;
})(FileSystem3 || (FileSystem3 = {}));
function getSegments(path2) {
  if (path2.charAt(0) === "/") {
    path2 = path2.substring(1);
  }
  if (path2.charAt(path2.length - 1) === "/") {
    path2 = path2.substring(0, path2.length - 1);
  }
  return path2.normalize().split("/");
}
var MapDirDescriptors;
((MapDirDescriptors2) => {
  function isExtensionLocation(descriptor) {
    return descriptor.kind === "extensionLocation";
  }
  MapDirDescriptors2.isExtensionLocation = isExtensionLocation;
  function isMemoryDescriptor(descriptor) {
    return descriptor.kind === "memoryFileSystem";
  }
  MapDirDescriptors2.isMemoryDescriptor = isMemoryDescriptor;
  function isVSCodeFileSystemDescriptor(descriptor) {
    return descriptor.kind === "vscodeFileSystem";
  }
  MapDirDescriptors2.isVSCodeFileSystemDescriptor = isVSCodeFileSystemDescriptor;
  function getExtensionLocationKey(descriptor) {
    return import_vscode7.Uri.joinPath(descriptor.extension.extensionUri, ...getSegments(descriptor.path));
  }
  MapDirDescriptors2.getExtensionLocationKey = getExtensionLocationKey;
  function getMemoryKey(descriptor) {
    return descriptor.fileSystem.uri;
  }
  MapDirDescriptors2.getMemoryKey = getMemoryKey;
  function getVScodeFileSystemKey(descriptor) {
    return descriptor.uri;
  }
  MapDirDescriptors2.getVScodeFileSystemKey = getVScodeFileSystemKey;
  function key(descriptor) {
    switch (descriptor.kind) {
      case "extensionLocation":
        return getExtensionLocationKey(descriptor);
      case "memoryFileSystem":
        return getMemoryKey(descriptor);
      case "vscodeFileSystem":
        return getVScodeFileSystemKey(descriptor);
      default:
        throw new Error(`Unknown MapDirDescriptor kind ${JSON.stringify(descriptor, void 0, 0)}`);
    }
  }
  MapDirDescriptors2.key = key;
  function getDescriptors(descriptors) {
    const extensions2 = [];
    const vscodeFileSystems = [];
    const memoryFileSystems = [];
    if (descriptors === void 0) {
      return { extensions: extensions2, vscodeFileSystems, memoryFileSystems };
    }
    for (const descriptor of descriptors) {
      if (descriptor.kind === "workspaceFolder") {
        const folders = import_vscode7.workspace.workspaceFolders;
        if (folders !== void 0) {
          if (folders.length === 1) {
            vscodeFileSystems.push(mapWorkspaceFolder(folders[0], true));
          } else {
            for (const folder of folders) {
              vscodeFileSystems.push(mapWorkspaceFolder(folder, false));
            }
          }
        }
      } else if (descriptor.kind === "extensionLocation") {
        extensions2.push(descriptor);
      } else if (descriptor.kind === "vscodeFileSystem") {
        vscodeFileSystems.push(descriptor);
      } else if (descriptor.kind === "memoryFileSystem") {
        memoryFileSystems.push(descriptor);
      }
    }
    return { extensions: extensions2, vscodeFileSystems, memoryFileSystems };
  }
  MapDirDescriptors2.getDescriptors = getDescriptors;
  function mapWorkspaceFolder(folder, single) {
    const path2 = ral_default().path;
    const mountPoint = single ? path2.join(path2.sep, "workspace") : path2.join(path2.sep, "workspaces", folder.name);
    return { kind: "vscodeFileSystem", uri: folder.uri, mountPoint };
  }
})(MapDirDescriptors || (MapDirDescriptors = {}));
var FileSystems = class {
  constructor() {
    __publicField(this, "contributionIdToUri");
    __publicField(this, "contributedFileSystems");
    __publicField(this, "fileSystemDeviceDrivers");
    this.contributionIdToUri = /* @__PURE__ */ new Map();
    this.contributedFileSystems = /* @__PURE__ */ new Map();
    this.fileSystemDeviceDrivers = /* @__PURE__ */ new Map();
    this.parseWorkspaceFolders();
    import_vscode7.workspace.onDidChangeWorkspaceFolders((event2) => this.handleWorkspaceFoldersChanged(event2));
    const fileSystems = this.parseFileSystems();
    for (const fileSystem of fileSystems) {
      this.contributedFileSystems.set(fileSystem.id.toString(), fileSystem.mapDir);
      this.contributionIdToUri.set(fileSystem.contributionId, fileSystem.id);
    }
    import_vscode7.extensions.onDidChange(() => this.handleExtensionsChanged());
  }
  async getFileSystem(uri2) {
    const key = uri2.toString();
    let result = this.fileSystemDeviceDrivers.get(key);
    if (result !== void 0) {
      return result;
    }
    const mapDir = this.contributedFileSystems.get(key);
    if (mapDir !== void 0) {
      if (mapDir.kind === "extensionLocation") {
        try {
          const result2 = await this.createExtensionLocationFileSystem(mapDir);
          this.fileSystemDeviceDrivers.set(key, result2);
        } catch (error) {
          return void 0;
        }
      }
    }
    return void 0;
  }
  async createRootFileSystem(fileDescriptors, descriptors) {
    const fileSystems = [];
    const preOpens = /* @__PURE__ */ new Map();
    const { extensions: extensions2, vscodeFileSystems, memoryFileSystems } = MapDirDescriptors.getDescriptors(descriptors);
    if (extensions2.length > 0) {
      for (const descriptor of extensions2) {
        const key = MapDirDescriptors.getExtensionLocationKey(descriptor);
        let fs = this.fileSystemDeviceDrivers.get(key.toString());
        if (fs === void 0) {
          fs = await this.createExtensionLocationFileSystem(descriptor);
          this.fileSystemDeviceDrivers.set(key.toString(), fs);
        }
        fileSystems.push(fs);
        preOpens.set(descriptor.mountPoint, fs);
      }
    }
    if (vscodeFileSystems.length > 0) {
      for (const descriptor of vscodeFileSystems) {
        const key = MapDirDescriptors.getVScodeFileSystemKey(descriptor);
        let fs = this.fileSystemDeviceDrivers.get(key.toString());
        if (fs === void 0) {
          fs = create2(WasiKernel.nextDeviceId(), descriptor.uri, !(import_vscode7.workspace.fs.isWritableFileSystem(descriptor.uri.scheme) ?? true));
          this.fileSystemDeviceDrivers.set(key.toString(), fs);
        }
        fileSystems.push(fs);
        preOpens.set(descriptor.mountPoint, fs);
      }
    }
    if (memoryFileSystems.length > 0) {
      for (const descriptor of memoryFileSystems) {
        const fs = create4(WasiKernel.nextDeviceId(), descriptor.fileSystem);
        fileSystems.push(fs);
        preOpens.set(descriptor.mountPoint, fs);
      }
    }
    let needsRootFs = false;
    for (const mountPoint of preOpens.keys()) {
      if (mountPoint === "/") {
        if (preOpens.size > 1) {
          throw new Error(`Cannot mount root directory when other directories are mounted as well.`);
        }
      } else {
        needsRootFs = true;
      }
    }
    const deviceDrivers = new DeviceDriversImpl();
    let result;
    if (needsRootFs) {
      const mountPoints = new Map(Array.from(preOpens.entries()));
      const fs = create5(WasiKernel.nextDeviceId(), fileDescriptors, mountPoints);
      preOpens.set("/", fs);
      fileSystems.push(fs);
      result = { kind: "virtual", fileSystem: fs, deviceDrivers, preOpens };
    } else {
      result = { kind: "single", fileSystem: fileSystems[0], deviceDrivers, preOpens };
    }
    for (const fs of fileSystems) {
      deviceDrivers.add(fs);
    }
    return result;
  }
  async getOrCreateFileSystemByDescriptor(deviceDrivers, descriptor, manage = 3 /* default */) {
    const key = MapDirDescriptors.key(descriptor);
    if (deviceDrivers.hasByUri(key)) {
      return deviceDrivers.getByUri(key);
    }
    let result = this.fileSystemDeviceDrivers.get(key.toString());
    if (result !== void 0) {
      deviceDrivers.add(result);
      return result;
    }
    if (MapDirDescriptors.isExtensionLocation(descriptor)) {
      result = await this.createExtensionLocationFileSystem(descriptor);
      if (manage === 3 /* default */) {
        manage = 2 /* yes */;
      }
    } else if (MapDirDescriptors.isMemoryDescriptor(descriptor)) {
      result = create4(WasiKernel.nextDeviceId(), descriptor.fileSystem);
      if (manage === 3 /* default */) {
        manage = 1 /* no */;
      }
    } else if (MapDirDescriptors.isVSCodeFileSystemDescriptor(descriptor)) {
      result = create2(WasiKernel.nextDeviceId(), descriptor.uri, !(import_vscode7.workspace.fs.isWritableFileSystem(descriptor.uri.scheme) ?? true));
      if (manage === 3 /* default */) {
        manage = 2 /* yes */;
      }
    }
    if (result !== void 0 && manage === 2 /* yes */) {
      this.fileSystemDeviceDrivers.set(key.toString(), result);
    }
    if (result === void 0) {
      throw new Error(`Unable to create file system for ${JSON.stringify(descriptor, void 0, 0)}`);
    }
    deviceDrivers.add(result);
    return result;
  }
  parseFileSystems() {
    const result = [];
    for (const extension of import_vscode7.extensions.all) {
      const packageJSON = extension.packageJSON;
      const fileSystems = packageJSON?.contributes?.wasm?.fileSystems;
      if (fileSystems !== void 0) {
        for (const contribution of fileSystems) {
          if (ExtensionDataFileSystem.is(contribution)) {
            const mapDir = {
              kind: "extensionLocation",
              extension,
              path: contribution.path,
              mountPoint: contribution.mountPoint
            };
            const id = import_vscode7.Uri.joinPath(extension.extensionUri, ...getSegments(contribution.path));
            result.push({ id, contributionId: contribution.id, mapDir });
          }
        }
      }
    }
    return result;
  }
  handleExtensionsChanged() {
    const oldFileSystems = new Map(this.contributedFileSystems.entries());
    const newFileSystems = new Map(this.parseFileSystems().map((fileSystem) => [fileSystem.id.toString(), fileSystem.mapDir]));
    const added = /* @__PURE__ */ new Map();
    for (const [id, newFileSystem] of newFileSystems) {
      if (oldFileSystems.has(id)) {
        oldFileSystems.delete(id);
      } else {
        added.set(id, newFileSystem);
      }
    }
    for (const [id, add] of added) {
      this.contributedFileSystems.set(id, add);
    }
    for (const id of oldFileSystems.keys()) {
      this.contributedFileSystems.delete(id);
      this.fileSystemDeviceDrivers.delete(id);
    }
  }
  parseWorkspaceFolders() {
    const folders = import_vscode7.workspace.workspaceFolders;
    if (folders !== void 0) {
      for (const folder of folders) {
        const key = folder.uri.toString();
        if (!this.fileSystemDeviceDrivers.has(key)) {
          const driver = create2(WasiKernel.nextDeviceId(), folder.uri, !(import_vscode7.workspace.fs.isWritableFileSystem(folder.uri.scheme) ?? true));
          this.fileSystemDeviceDrivers.set(key, driver);
        }
      }
    }
  }
  handleWorkspaceFoldersChanged(event2) {
    for (const added of event2.added) {
      const key = added.uri.toString();
      if (!this.fileSystemDeviceDrivers.has(key)) {
        const driver = create2(WasiKernel.nextDeviceId(), added.uri, !(import_vscode7.workspace.fs.isWritableFileSystem(added.uri.scheme) ?? true));
        this.fileSystemDeviceDrivers.set(key, driver);
      }
    }
    for (const removed of event2.removed) {
      const key = removed.uri.toString();
      this.fileSystemDeviceDrivers.delete(key);
    }
  }
  async createExtensionLocationFileSystem(descriptor) {
    let extensionUri = descriptor.extension.extensionUri;
    extensionUri = extensionUri.with({ path: ral_default().path.join(extensionUri.path, descriptor.path) });
    const paths2 = ral_default().path;
    const basename = paths2.basename(descriptor.path);
    const dirname = paths2.dirname(descriptor.path);
    const dirDumpFileUri = import_vscode7.Uri.joinPath(descriptor.extension.extensionUri, dirname, `${basename}.dir.json`);
    try {
      const content = await import_vscode7.workspace.fs.readFile(dirDumpFileUri);
      const dirDump = JSON.parse(ral_default().TextDecoder.create().decode(content));
      const extensionFS = create3(WasiKernel.nextDeviceId(), extensionUri, dirDump);
      return extensionFS;
    } catch (error) {
      ral_default().console.error(`Failed to read directory dump file ${dirDumpFileUri.toString()}: ${error}`);
      throw error;
    }
  }
};
var WasiKernel;
((WasiKernel2) => {
  let deviceCounter = 1n;
  function nextDeviceId() {
    return deviceCounter++;
  }
  WasiKernel2.nextDeviceId = nextDeviceId;
  const fileSystems = new FileSystems();
  function getOrCreateFileSystemByDescriptor(deviceDrivers2, descriptor) {
    return fileSystems.getOrCreateFileSystemByDescriptor(deviceDrivers2, descriptor);
  }
  WasiKernel2.getOrCreateFileSystemByDescriptor = getOrCreateFileSystemByDescriptor;
  function createRootFileSystem(fileDescriptors, descriptors) {
    return fileSystems.createRootFileSystem(fileDescriptors, descriptors);
  }
  WasiKernel2.createRootFileSystem = createRootFileSystem;
  WasiKernel2.deviceDrivers = new DeviceDriversImpl();
  WasiKernel2.console = create(nextDeviceId());
  WasiKernel2.deviceDrivers.add(WasiKernel2.console);
  function createLocalDeviceDrivers() {
    return new LocalDeviceDrivers(WasiKernel2.deviceDrivers);
  }
  WasiKernel2.createLocalDeviceDrivers = createLocalDeviceDrivers;
})(WasiKernel || (WasiKernel = {}));
var kernel_default = WasiKernel;

// src/common/terminal.ts
var import_vscode8 = require("vscode");
var LineBuffer = class {
  constructor() {
    __publicField(this, "offset");
    __publicField(this, "cursor");
    __publicField(this, "content");
    this.offset = 0;
    this.cursor = 0;
    this.content = [];
  }
  clear() {
    this.offset = 0;
    this.cursor = 0;
    this.content = [];
  }
  setContent(content) {
    this.content = content.split("");
    this.cursor = this.content.length;
  }
  getOffset() {
    return this.offset;
  }
  setOffset(offset) {
    this.offset = offset;
  }
  getLine() {
    return this.content.join("");
  }
  getCursor() {
    return this.cursor;
  }
  isCursorAtEnd() {
    return this.cursor === this.content.length;
  }
  isCursorAtBeginning() {
    return this.cursor === 0;
  }
  insert(value) {
    for (const char of value) {
      this.content.splice(this.cursor, 0, char);
      this.cursor++;
    }
  }
  del() {
    if (this.cursor === this.content.length) {
      return false;
    }
    this.content.splice(this.cursor, 1);
    return true;
  }
  backspace() {
    if (this.cursor === 0) {
      return false;
    }
    this.cursor -= 1;
    this.content.splice(this.cursor, 1);
    return true;
  }
  moveCursorRelative(characters) {
    const newValue = this.cursor + characters;
    if (newValue < 0 || newValue > this.content.length) {
      return false;
    }
    this.cursor = newValue;
    return true;
  }
  moveCursorStartOfLine() {
    if (this.cursor === 0) {
      return false;
    }
    this.cursor = 0;
    return true;
  }
  moveCursorEndOfLine() {
    if (this.cursor === this.content.length) {
      return false;
    }
    this.cursor = this.content.length;
    return true;
  }
  moveCursorWordLeft() {
    if (this.cursor === 0) {
      return false;
    }
    let index;
    if (this.content[this.cursor - 1] === " ") {
      index = this.cursor - 2;
      while (index > 0) {
        if (this.content[index] === " ") {
          index--;
        } else {
          break;
        }
      }
    } else {
      index = this.cursor;
    }
    if (index === 0) {
      this.cursor = index;
      return true;
    }
    while (index > 0) {
      if (this.content[index] === " ") {
        index++;
        break;
      } else {
        index--;
      }
    }
    this.cursor = index;
    return true;
  }
  moveCursorWordRight() {
    if (this.cursor === this.content.length) {
      return false;
    }
    let index;
    if (this.content[this.cursor] === " ") {
      index = this.cursor + 1;
      while (index < this.content.length) {
        if (this.content[index] === " ") {
          index++;
        } else {
          break;
        }
      }
    } else {
      index = this.cursor;
    }
    if (index === this.content.length) {
      this.cursor = index;
      return true;
    }
    while (index < this.content.length) {
      if (this.content[index] === " ") {
        break;
      } else {
        index++;
      }
    }
    this.cursor = index;
    return true;
  }
};
var CommandHistory = class {
  constructor() {
    __publicField(this, "history");
    __publicField(this, "current");
    this.history = [""];
    this.current = 0;
  }
  update(command) {
    this.history[this.history.length - 1] = command;
  }
  markExecuted() {
    if (this.current !== this.history.length - 1) {
      this.history[this.history.length - 1] = this.history[this.current];
    }
    if (this.history[this.history.length - 1] === this.history[this.history.length - 2]) {
      this.history.pop();
    }
    this.history.push("");
    this.current = this.history.length - 1;
  }
  previous() {
    if (this.current === 0) {
      return void 0;
    }
    return this.history[--this.current];
  }
  next() {
    if (this.current === this.history.length - 1) {
      return void 0;
    }
    return this.history[++this.current];
  }
};
var _WasmPseudoterminalImpl = class _WasmPseudoterminalImpl {
  constructor(options = {}) {
    __publicField(this, "options");
    __publicField(this, "commandHistory");
    __publicField(this, "state");
    __publicField(this, "_onDidClose");
    __publicField(this, "onDidClose");
    __publicField(this, "_onDidWrite");
    __publicField(this, "onDidWrite");
    __publicField(this, "_onDidChangeName");
    __publicField(this, "onDidChangeName");
    __publicField(this, "_onDidCtrlC");
    __publicField(this, "onDidCtrlC");
    __publicField(this, "_onAnyKey");
    __publicField(this, "onAnyKey");
    __publicField(this, "_onDidChangeState");
    __publicField(this, "onDidChangeState");
    __publicField(this, "_onDidCloseTerminal");
    __publicField(this, "onDidCloseTerminal");
    __publicField(this, "lines");
    __publicField(this, "lineBuffer");
    __publicField(this, "readlineCallback");
    __publicField(this, "isOpen");
    __publicField(this, "nameBuffer");
    __publicField(this, "writeBuffer");
    __publicField(this, "encoder");
    __publicField(this, "decoder");
    this.options = options;
    this.commandHistory = this.options.history ? new CommandHistory() : void 0;
    this.state = 3 /* busy */;
    this._onDidClose = new import_vscode8.EventEmitter();
    this.onDidClose = this._onDidClose.event;
    this._onDidWrite = new import_vscode8.EventEmitter();
    this.onDidWrite = this._onDidWrite.event;
    this._onDidChangeName = new import_vscode8.EventEmitter();
    this.onDidChangeName = this._onDidChangeName.event;
    this._onDidCtrlC = new import_vscode8.EventEmitter();
    this.onDidCtrlC = this._onDidCtrlC.event;
    this._onAnyKey = new import_vscode8.EventEmitter();
    this.onAnyKey = this._onAnyKey.event;
    this._onDidChangeState = new import_vscode8.EventEmitter();
    this.onDidChangeState = this._onDidChangeState.event;
    this._onDidCloseTerminal = new import_vscode8.EventEmitter();
    this.onDidCloseTerminal = this._onDidCloseTerminal.event;
    this.encoder = ral_default().TextEncoder.create();
    this.decoder = ral_default().TextDecoder.create();
    this.lines = [];
    this.lineBuffer = new LineBuffer();
    this.isOpen = false;
  }
  get stdio() {
    return {
      in: { kind: "terminal", terminal: this },
      out: { kind: "terminal", terminal: this },
      err: { kind: "terminal", terminal: this }
    };
  }
  setState(state) {
    const old = this.state;
    this.state = state;
    if (old !== state) {
      this._onDidChangeState.fire({ old, new: state });
    }
  }
  getState() {
    return this.state;
  }
  setName(name) {
    if (this.isOpen) {
      this._onDidChangeName.fire(name);
    } else {
      this.nameBuffer = name;
    }
  }
  open() {
    this.isOpen = true;
    if (this.nameBuffer !== void 0) {
      this._onDidChangeName.fire(this.nameBuffer);
      this.nameBuffer = void 0;
    }
    if (this.writeBuffer !== void 0) {
      for (const item of this.writeBuffer) {
        this._onDidWrite.fire(item);
      }
      this.writeBuffer = void 0;
    }
  }
  close() {
    this._onDidCloseTerminal.fire();
  }
  async read(_maxBytesToRead) {
    const value = await this.readline();
    return this.encoder.encode(value);
  }
  readline() {
    if (this.readlineCallback !== void 0) {
      throw new Error(`Already in readline mode`);
    }
    if (this.lines.length > 0) {
      return Promise.resolve(this.lines.shift());
    }
    return new Promise((resolve) => {
      this.readlineCallback = resolve;
    });
  }
  write(content, encoding) {
    if (typeof content === "string") {
      this.writeString(this.replaceNewlines(content));
      return Promise.resolve();
    } else {
      this.writeString(this.getString(content, encoding));
      return Promise.resolve(content.byteLength);
    }
  }
  writeString(str) {
    if (this.isOpen) {
      this._onDidWrite.fire(str);
    } else {
      if (this.writeBuffer === void 0) {
        this.writeBuffer = [];
      }
      this.writeBuffer.push(str);
    }
  }
  async prompt(prompt) {
    await this.write(prompt);
    this.lineBuffer.setOffset(prompt.length);
  }
  handleInput(data) {
    if (this.state === 1 /* free */) {
      this._onAnyKey.fire();
      return;
    }
    const previousCursor = this.lineBuffer.getCursor();
    switch (data) {
      case "":
        this.handleInterrupt();
        break;
      case "":
      case "\x1B[C":
        this.adjustCursor(this.lineBuffer.moveCursorRelative(1), previousCursor, this.lineBuffer.getCursor());
        break;
      case "\x1Bf":
      case "\x1B[1;5C":
        this.adjustCursor(this.lineBuffer.moveCursorWordRight(), previousCursor, this.lineBuffer.getCursor());
        break;
      case "":
      case "\x1B[D":
        this.adjustCursor(this.lineBuffer.moveCursorRelative(-1), previousCursor, this.lineBuffer.getCursor());
        break;
      case "\x1Bb":
      case "\x1B[1;5D":
        this.adjustCursor(this.lineBuffer.moveCursorWordLeft(), previousCursor, this.lineBuffer.getCursor());
        break;
      case "":
      case "\x1B[H":
        this.adjustCursor(this.lineBuffer.moveCursorStartOfLine(), previousCursor, this.lineBuffer.getCursor());
        break;
      case "":
      case "\x1B[F":
        this.adjustCursor(this.lineBuffer.moveCursorEndOfLine(), previousCursor, this.lineBuffer.getCursor());
        break;
      case "\x1B[A":
        if (this.commandHistory === void 0) {
          this.bell();
        } else {
          const content = this.commandHistory.previous();
          if (content !== void 0) {
            this.eraseLine();
            this.lineBuffer.setContent(content);
            this.writeString(content);
          } else {
            this.bell();
          }
        }
        break;
      case "\x1B[B":
        if (this.commandHistory === void 0) {
          this.bell();
        } else {
          const content = this.commandHistory.next();
          if (content !== void 0) {
            this.eraseLine();
            this.lineBuffer.setContent(content);
            this.writeString(content);
          } else {
            this.bell();
          }
        }
        break;
      case "\b":
      case "\x7F":
        this.lineBuffer.backspace() ? this._onDidWrite.fire("\x1B[D\x1B[P") : this.bell();
        break;
      case "\x1B[3~":
        this.lineBuffer.del() ? this._onDidWrite.fire("\x1B[P") : this.bell();
        break;
      case "\r":
        this.handleEnter();
        break;
      default:
        this.lineBuffer.insert(data);
        if (!this.lineBuffer.isCursorAtEnd()) {
          this._onDidWrite.fire("\x1B[@");
        }
        this._onDidWrite.fire(data);
        if (this.commandHistory !== void 0) {
          this.commandHistory.update(this.lineBuffer.getLine());
        }
    }
  }
  handleInterrupt() {
    this._onDidCtrlC.fire();
    this._onDidWrite.fire("\x1B[31m^C\x1B[0m\r\n");
    this.lineBuffer.clear();
    this.lines.length = 0;
    this.readlineCallback?.("\n");
    this.readlineCallback = void 0;
  }
  handleEnter() {
    this._onDidWrite.fire("\r\n");
    const line = this.lineBuffer.getLine();
    this.lineBuffer.clear();
    this.lines.push(line);
    if (this.commandHistory !== void 0) {
      this.commandHistory.markExecuted();
    }
    if (this.readlineCallback !== void 0) {
      const result = this.lines.shift() + "\n";
      this.readlineCallback(result);
      this.readlineCallback = void 0;
    }
  }
  adjustCursor(success, oldCursor, newCursor) {
    if (!success) {
      this.bell();
      return;
    }
    const change = oldCursor - newCursor;
    const code2 = change > 0 ? "D" : "C";
    const sequence = `\x1B[${code2}`.repeat(Math.abs(change));
    this._onDidWrite.fire(sequence);
  }
  eraseLine() {
    const cursor = this.lineBuffer.getCursor();
    this.adjustCursor(true, cursor, 0);
    this._onDidWrite.fire(`\x1B[0J`);
  }
  bell() {
    this._onDidWrite.fire("\x07");
  }
  replaceNewlines(str) {
    return str.replace(_WasmPseudoterminalImpl.terminalRegExp, (match, m1, m2) => {
      if (m1) {
        return m1;
      } else if (m2) {
        return "\r\n";
      } else {
        return match;
      }
    });
  }
  getString(bytes, _encoding) {
    return this.replaceNewlines(this.decoder.decode(bytes.slice()));
  }
};
__publicField(_WasmPseudoterminalImpl, "terminalRegExp", /(\r\n)|(\n)/gm);
var WasmPseudoterminalImpl = _WasmPseudoterminalImpl;

// src/common/api.ts
var OpenFlags;
((OpenFlags2) => {
  OpenFlags2.none = 0;
  OpenFlags2.create = 1 << 0;
  OpenFlags2.directory = 1 << 1;
  OpenFlags2.exclusive = 1 << 2;
  OpenFlags2.truncate = 1 << 3;
})(OpenFlags || (OpenFlags = {}));
var MemoryDescriptor;
((MemoryDescriptor2) => {
  function is(value) {
    const candidate = value;
    return candidate && typeof candidate === "object" && typeof candidate.initial === "number" && (typeof candidate.maximum === "number" || candidate.maximum === void 0) && (typeof candidate.shared === "boolean" || candidate.shared === void 0);
  }
  MemoryDescriptor2.is = is;
})(MemoryDescriptor || (MemoryDescriptor = {}));
var WasiCoreImpl;
((WasiCoreImpl2) => {
  function create8(context, processConstructor, compile) {
    const version = context.extension.packageJSON?.version;
    if (typeof version !== "string") {
      throw new Error(`Failed to determine extension version. Found ${version}`);
    }
    return {
      version,
      versions: { api: 1, extension: version },
      createPseudoterminal(options) {
        return new WasmPseudoterminalImpl(options);
      },
      createMemoryFileSystem() {
        return Promise.resolve(new MemoryFileSystem());
      },
      async createRootFileSystem(mountDescriptors) {
        const fileDescriptors = new FileDescriptors();
        const info = await kernel_default.createRootFileSystem(fileDescriptors, mountDescriptors);
        const result = new WasmRootFileSystemImpl(info, fileDescriptors);
        await result.initialize();
        return result;
      },
      createReadable() {
        return new ReadableStream();
      },
      createWritable(encoding) {
        return new WritableStream(encoding);
      },
      async createProcess(name, module2, memoryOrOptions, optionsOrMapWorkspaceFolders) {
        let memory;
        let options;
        if (memoryOrOptions instanceof WebAssembly.Memory || MemoryDescriptor.is(memoryOrOptions)) {
          memory = memoryOrOptions;
          options = optionsOrMapWorkspaceFolders;
        } else {
          options = memoryOrOptions;
        }
        const result = new processConstructor(context.extensionUri, name, module2, memory, options);
        await result.initialize();
        return result;
      },
      compile
    };
  }
  WasiCoreImpl2.create = create8;
})(WasiCoreImpl || (WasiCoreImpl = {}));
var APILoader = class {
  constructor(context, processConstructor, compile) {
    __publicField(this, "context");
    __publicField(this, "processConstructor");
    __publicField(this, "compile");
    this.context = context;
    this.processConstructor = processConstructor;
    this.compile = compile;
  }
  load(_apiVersion) {
    return WasiCoreImpl.create(this.context, this.processConstructor, this.compile);
  }
};

// src/desktop/process.ts
var import_node_worker_threads = require("worker_threads");
var import_vscode12 = require("vscode");

// src/common/process.ts
var import_vscode11 = require("vscode");

// src/common/terminalDriver.ts
var import_vscode9 = require("vscode");
var TerminalBaseRights = Rights.fd_read | Rights.fd_fdstat_set_flags | Rights.fd_write | Rights.fd_filestat_get | Rights.poll_fd_readwrite;
var TerminalInheritingRights = 0n;
var TerminalFileDescriptor = class _TerminalFileDescriptor extends BaseFileDescriptor {
  constructor(deviceId, fd11, rights_base, rights_inheriting, fdflags11, inode6) {
    super(deviceId, fd11, Filetype.character_device, rights_base, rights_inheriting, fdflags11, inode6);
  }
  with(change) {
    return new _TerminalFileDescriptor(this.deviceId, change.fd, this.rights_base, this.rights_inheriting, this.fdflags, this.inode);
  }
};
function create6(deviceId, terminal) {
  let inodeCounter = 0n;
  function createTerminalFileDescriptor(fd11) {
    return new TerminalFileDescriptor(deviceId, fd11, TerminalBaseRights, TerminalInheritingRights, 0, inodeCounter++);
  }
  const deviceDriver = {
    kind: "character" /* character */,
    id: deviceId,
    uri: import_vscode9.Uri.from({ scheme: "wasi-terminal", authority: deviceId.toString() }),
    createStdioFileDescriptor(fd11) {
      return createTerminalFileDescriptor(fd11);
    },
    fd_fdstat_get(fileDescriptor, result) {
      result.fs_filetype = fileDescriptor.fileType;
      result.fs_flags = fileDescriptor.fdflags;
      result.fs_rights_base = fileDescriptor.rights_base;
      result.fs_rights_inheriting = fileDescriptor.rights_inheriting;
      return Promise.resolve();
    },
    fd_filestat_get(fileDescriptor, result) {
      result.dev = fileDescriptor.deviceId;
      result.ino = fileDescriptor.inode;
      result.filetype = Filetype.character_device;
      result.nlink = 0n;
      result.size = 101n;
      const now = BigInt(Date.now());
      result.atim = now;
      result.ctim = now;
      result.mtim = now;
      return Promise.resolve();
    },
    async fd_read(_fileDescriptor, buffers) {
      if (buffers.length === 0) {
        return 0;
      }
      const maxBytesToRead = buffers.reduce((prev, current) => prev + current.length, 0);
      const result = await terminal.read(maxBytesToRead);
      let offset = 0;
      let totalBytesRead = 0;
      for (const buffer of buffers) {
        const toCopy = Math.min(buffer.length, result.length - offset);
        buffer.set(result.subarray(offset, offset + toCopy));
        offset += toCopy;
        totalBytesRead += toCopy;
        if (toCopy < buffer.length) {
          break;
        }
      }
      return totalBytesRead;
    },
    fd_write(_fileDescriptor, buffers) {
      let buffer;
      if (buffers.length === 1) {
        buffer = buffers[0];
      } else {
        const byteLength = buffers.reduce((prev, current) => prev + current.length, 0);
        buffer = new Uint8Array(byteLength);
        let offset = 0;
        for (const item of buffers) {
          buffer.set(item, offset);
          offset = item.byteLength;
        }
      }
      return terminal.write(buffer);
    }
  };
  return Object.assign({}, NoSysDeviceDriver, deviceDriver);
}

// src/common/pipeDriver.ts
var import_vscode10 = require("vscode");
var PipeBaseRights = Rights.fd_read | Rights.fd_fdstat_set_flags | Rights.fd_write | Rights.fd_filestat_get | Rights.poll_fd_readwrite;
var PipeInheritingRights = 0n;
var PipeFileDescriptor = class _PipeFileDescriptor extends BaseFileDescriptor {
  constructor(deviceId, fd11, rights_base, rights_inheriting, fdflags11, inode6) {
    super(deviceId, fd11, Filetype.character_device, rights_base, rights_inheriting, fdflags11, inode6);
  }
  with(change) {
    return new _PipeFileDescriptor(this.deviceId, change.fd, this.rights_base, this.rights_inheriting, this.fdflags, this.inode);
  }
};
function create7(deviceId, stdin, stdout, stderr) {
  let inodeCounter = 0n;
  function createPipeFileDescriptor(fd11) {
    return new PipeFileDescriptor(deviceId, fd11, PipeBaseRights, PipeInheritingRights, 0, inodeCounter++);
  }
  const deviceDriver = {
    kind: "character" /* character */,
    id: deviceId,
    uri: import_vscode10.Uri.from({ scheme: "wasi-pipe", authority: deviceId.toString() }),
    createStdioFileDescriptor(fd11) {
      if (fd11 === 0 && stdin !== void 0) {
        return createPipeFileDescriptor(fd11);
      } else if (fd11 === 1 && stdout !== void 0) {
        return createPipeFileDescriptor(fd11);
      } else if (fd11 === 2 && stderr !== void 0) {
        return createPipeFileDescriptor(fd11);
      }
      throw new WasiError(Errno.badf);
    },
    fd_fdstat_get(fileDescriptor, result) {
      result.fs_filetype = fileDescriptor.fileType;
      result.fs_flags = fileDescriptor.fdflags;
      result.fs_rights_base = fileDescriptor.rights_base;
      result.fs_rights_inheriting = fileDescriptor.rights_inheriting;
      return Promise.resolve();
    },
    fd_filestat_get(fileDescriptor, result) {
      result.dev = fileDescriptor.deviceId;
      result.ino = fileDescriptor.inode;
      result.filetype = Filetype.character_device;
      result.nlink = 0n;
      result.size = 101n;
      const now = BigInt(Date.now());
      result.atim = now;
      result.ctim = now;
      result.mtim = now;
      return Promise.resolve();
    },
    async fd_read(_fileDescriptor, buffers) {
      if (buffers.length === 0) {
        return 0;
      }
      if (stdin === void 0) {
        throw new WasiError(Errno.badf);
      }
      const maxBytesToRead = buffers.reduce((prev, current) => prev + current.length, 0);
      const result = await stdin.read("max", maxBytesToRead);
      let offset = 0;
      let totalBytesRead = 0;
      for (const buffer of buffers) {
        const toCopy = Math.min(buffer.length, result.length - offset);
        buffer.set(result.subarray(offset, offset + toCopy));
        offset += toCopy;
        totalBytesRead += toCopy;
        if (toCopy < buffer.length) {
          break;
        }
      }
      return totalBytesRead;
    },
    async fd_write(fileDescriptor, buffers) {
      let buffer;
      if (buffers.length === 1) {
        buffer = buffers[0];
      } else {
        const byteLength = buffers.reduce((prev, current) => prev + current.length, 0);
        buffer = new Uint8Array(byteLength);
        let offset = 0;
        for (const item of buffers) {
          buffer.set(item, offset);
          offset = item.byteLength;
        }
      }
      if (fileDescriptor.fd === 1 && stdout !== void 0) {
        await stdout.write(buffer);
        return Promise.resolve(buffer.byteLength);
      } else if (fileDescriptor.fd === 2 && stderr !== void 0) {
        await stderr.write(buffer);
        return Promise.resolve(buffer.byteLength);
      }
      throw new WasiError(Errno.badf);
    }
  };
  return Object.assign({}, NoSysDeviceDriver, deviceDriver);
}

// src/common/process.ts
var MapDirDescriptor;
((MapDirDescriptor2) => {
  function getDescriptors(descriptors) {
    let workspaceFolders;
    const extensions2 = [];
    const vscodeFileSystems = [];
    const memoryFileSystems = [];
    if (descriptors === void 0) {
      return { workspaceFolders, extensions: extensions2, vscodeFileSystems, memoryFileSystems };
    }
    for (const descriptor of descriptors) {
      if (descriptor.kind === "workspaceFolder") {
        workspaceFolders = descriptor;
      } else if (descriptor.kind === "extensionLocation") {
        extensions2.push(descriptor);
      } else if (descriptor.kind === "vscodeFileSystem") {
        vscodeFileSystems.push(descriptor);
      } else if (descriptor.kind === "memoryFileSystem") {
        memoryFileSystems.push(descriptor);
      }
    }
    return { workspaceFolders, extensions: extensions2, vscodeFileSystems, memoryFileSystems };
  }
  MapDirDescriptor2.getDescriptors = getDescriptors;
})(MapDirDescriptor || (MapDirDescriptor = {}));
var MountPointOptions;
((MountPointOptions2) => {
  function is(value) {
    const candidate = value;
    return candidate && Array.isArray(candidate.mountPoints);
  }
  MountPointOptions2.is = is;
})(MountPointOptions || (MountPointOptions = {}));
var RootFileSystemOptions;
((RootFileSystemOptions2) => {
  function is(value) {
    const candidate = value;
    return candidate && candidate.rootFileSystem instanceof WasmRootFileSystemImpl;
  }
  RootFileSystemOptions2.is = is;
})(RootFileSystemOptions || (RootFileSystemOptions = {}));
var $channel;
function channel() {
  if ($channel === void 0) {
    $channel = import_vscode11.window.createOutputChannel("Wasm Core", { log: true });
  }
  return $channel;
}
var WasiProcess = class {
  constructor(programName, options = {}) {
    __publicField(this, "_state");
    __publicField(this, "programName");
    __publicField(this, "options");
    __publicField(this, "localDeviceDrivers");
    __publicField(this, "resolveCallback");
    __publicField(this, "threadIdCounter");
    __publicField(this, "fileDescriptors");
    __publicField(this, "environmentService");
    __publicField(this, "processService");
    __publicField(this, "preOpenDirectories");
    __publicField(this, "virtualRootFileSystem");
    __publicField(this, "_stdin");
    __publicField(this, "_stdout");
    __publicField(this, "_stderr");
    this.programName = programName;
    let opt = Object.assign({}, options);
    delete opt.trace;
    if (options.trace === true) {
      this.options = Object.assign({}, opt, { trace: channel() });
    } else {
      this.options = Object.assign({}, opt, { trace: void 0 });
    }
    this.threadIdCounter = 2;
    this.localDeviceDrivers = kernel_default.createLocalDeviceDrivers();
    this.fileDescriptors = new FileDescriptors();
    this.preOpenDirectories = /* @__PURE__ */ new Map();
    this._state = "created";
    this._stdin = void 0;
    this._stdout = void 0;
    this._stderr = void 0;
  }
  get stdin() {
    return this._stdin;
  }
  get stdout() {
    return this._stdout;
  }
  get stderr() {
    return this._stderr;
  }
  get state() {
    return this._state;
  }
  async initialize() {
    if (this._state !== "created") {
      throw new Error("WasiProcess already initialized or running");
    }
    if (MountPointOptions.is(this.options)) {
      const { workspaceFolders, extensions: extensions2, vscodeFileSystems, memoryFileSystems } = MapDirDescriptor.getDescriptors(this.options.mountPoints);
      if (workspaceFolders !== void 0) {
        const folders = import_vscode11.workspace.workspaceFolders;
        if (folders !== void 0) {
          if (folders.length === 1) {
            await this.mapWorkspaceFolder(folders[0], true);
          } else {
            for (const folder of folders) {
              await this.mapWorkspaceFolder(folder, false);
            }
          }
        }
      }
      if (extensions2.length > 0) {
        for (const descriptor of extensions2) {
          const extensionFS = await kernel_default.getOrCreateFileSystemByDescriptor(this.localDeviceDrivers, descriptor);
          this.preOpenDirectories.set(descriptor.mountPoint, extensionFS);
        }
      }
      if (vscodeFileSystems.length > 0) {
        for (const descriptor of vscodeFileSystems) {
          const fs = await kernel_default.getOrCreateFileSystemByDescriptor(this.localDeviceDrivers, descriptor);
          this.preOpenDirectories.set(descriptor.mountPoint, fs);
        }
      }
      if (memoryFileSystems.length > 0) {
        for (const descriptor of memoryFileSystems) {
          const dd = await kernel_default.getOrCreateFileSystemByDescriptor(this.localDeviceDrivers, descriptor);
          this.preOpenDirectories.set(descriptor.mountPoint, dd);
        }
      }
      let needsRootFs = false;
      for (const mountPoint of this.preOpenDirectories.keys()) {
        if (mountPoint === "/") {
          if (this.preOpenDirectories.size > 1) {
            throw new Error(`Cannot mount root directory when other directories are mounted as well.`);
          }
        } else {
          needsRootFs = true;
        }
      }
      if (needsRootFs) {
        const mountPoints = new Map(Array.from(this.preOpenDirectories.entries()));
        this.virtualRootFileSystem = create5(kernel_default.nextDeviceId(), this.fileDescriptors, mountPoints);
        this.preOpenDirectories.set("/", this.virtualRootFileSystem);
        this.localDeviceDrivers.add(this.virtualRootFileSystem);
      }
    } else if (RootFileSystemOptions.is(this.options)) {
      const devices = this.options.rootFileSystem.getDeviceDrivers();
      const preOpens = this.options.rootFileSystem.getPreOpenDirectories();
      this.virtualRootFileSystem = this.options.rootFileSystem.getVirtualRootFileSystem();
      for (const entry of preOpens) {
        this.preOpenDirectories.set(entry[0], entry[1]);
      }
      for (const device of devices) {
        this.localDeviceDrivers.add(device);
      }
    }
    const args = this.options.args !== void 0 ? [] : void 0;
    if (this.options.args !== void 0 && args !== void 0) {
      const path2 = ral_default().path;
      const uriToMountPoint = [];
      for (const [mountPoint, driver] of this.preOpenDirectories) {
        let vsc_uri = driver.uri.toString(true);
        if (!vsc_uri.endsWith(path2.sep)) {
          vsc_uri += path2.sep;
        }
        uriToMountPoint.push([vsc_uri, mountPoint]);
      }
      for (const arg of this.options.args) {
        if (typeof arg === "string") {
          args.push(arg);
        } else if (arg instanceof import_vscode11.Uri) {
          const arg_str = arg.toString(true);
          let mapped = false;
          for (const [uri2, mountPoint] of uriToMountPoint) {
            if (arg_str.startsWith(uri2)) {
              args.push(path2.join(mountPoint, arg_str.substring(uri2.length)));
              mapped = true;
              break;
            }
          }
          if (!mapped) {
            throw new Error(`Could not map argument ${arg_str} to a mount point.`);
          }
        } else {
          throw new Error("Invalid argument type");
        }
      }
    }
    const con = { kind: "console" };
    const stdio = Object.assign({ in: con, out: con, err: con }, this.options.stdio);
    await this.handleConsole(stdio);
    await this.handleTerminal(stdio);
    await this.handleFiles(stdio);
    await this.handlePipes(stdio);
    const noArgsOptions = Object.assign({}, this.options);
    delete noArgsOptions.args;
    const options = Object.assign({}, noArgsOptions, { args });
    this.environmentService = EnvironmentWasiService.create(
      this.fileDescriptors,
      this.programName,
      this.preOpenDirectories.entries(),
      options
    );
    this.processService = {
      proc_exit: async (_memory, exitCode) => {
        this._state = "exiting";
        await this.procExit();
        this.resolveRunPromise(exitCode);
        return Promise.resolve(Errno.success);
      },
      thread_exit: async (_memory, tid2) => {
        await this.threadEnded(tid2);
        return Promise.resolve(Errno.success);
      },
      "thread-spawn": async (_memory, start_args) => {
        try {
          const tid2 = this.threadIdCounter++;
          const clock = Clock.create();
          const wasiService = Object.assign(
            {},
            this.environmentService,
            ClockWasiService.create(clock),
            DeviceWasiService.create(this.localDeviceDrivers, this.fileDescriptors, clock, this.virtualRootFileSystem, options),
            this.processService
          );
          await this.startThread(wasiService, tid2, start_args);
          return Promise.resolve(tid2);
        } catch (error) {
          return Promise.resolve(-1);
        }
      }
    };
    this._state = "initialized";
  }
  async run() {
    if (this._state !== "initialized") {
      throw new Error("WasiProcess is not initialized");
    }
    return new Promise(async (resolve, reject) => {
      this.resolveCallback = resolve;
      const clock = Clock.create();
      const wasiService = Object.assign(
        {},
        this.environmentService,
        ClockWasiService.create(clock),
        DeviceWasiService.create(this.localDeviceDrivers, this.fileDescriptors, clock, this.virtualRootFileSystem, this.options),
        this.processService
      );
      this.startMain(wasiService).catch(reject);
      this._state = "running";
    }).then((exitCode) => {
      this._state = "exited";
      return exitCode;
    });
  }
  async destroyStreams() {
    if (this._stdin !== void 0) {
      await this._stdin.destroy();
      this._stdin = void 0;
    }
    if (this._stdout !== void 0) {
      await this._stdout.destroy();
      this._stdout = void 0;
    }
    if (this._stderr !== void 0) {
      await this._stderr.destroy();
      this._stderr = void 0;
    }
  }
  async cleanupFileDescriptors() {
    for (const fd11 of this.fileDescriptors.values()) {
      if (fd11.dispose !== void 0) {
        await fd11.dispose();
      }
    }
  }
  resolveRunPromise(exitCode) {
    if (this.resolveCallback !== void 0) {
      this.resolveCallback(exitCode);
    }
  }
  mapWorkspaceFolder(folder, single) {
    const path2 = ral_default().path;
    const mountPoint = single ? path2.join(path2.sep, "workspace") : path2.join(path2.sep, "workspaces", folder.name);
    return this.mapDirEntry(folder.uri, mountPoint);
  }
  async mapDirEntry(vscode_fs, mountPoint) {
    const fs = await kernel_default.getOrCreateFileSystemByDescriptor(this.localDeviceDrivers, { kind: "vscodeFileSystem", uri: vscode_fs, mountPoint });
    this.preOpenDirectories.set(mountPoint, fs);
  }
  async handleConsole(stdio) {
    if (stdio.in.kind === "console") {
      this.fileDescriptors.add(kernel_default.console.createStdioFileDescriptor(0));
    }
    if (stdio.out.kind === "console") {
      this.fileDescriptors.add(kernel_default.console.createStdioFileDescriptor(1));
    }
    if (stdio.out.kind === "console") {
      this.fileDescriptors.add(kernel_default.console.createStdioFileDescriptor(2));
    }
  }
  async handleTerminal(stdio) {
    const terminalDevices = /* @__PURE__ */ new Map();
    if (stdio.in.kind === "terminal") {
      this.fileDescriptors.add(this.getTerminalDevice(terminalDevices, stdio.in.terminal).createStdioFileDescriptor(0));
    }
    if (stdio.out.kind === "terminal") {
      this.fileDescriptors.add(this.getTerminalDevice(terminalDevices, stdio.out.terminal).createStdioFileDescriptor(1));
    }
    if (stdio.err.kind === "terminal") {
      this.fileDescriptors.add(this.getTerminalDevice(terminalDevices, stdio.err.terminal).createStdioFileDescriptor(2));
    }
  }
  getTerminalDevice(devices, terminal) {
    let result = devices.get(terminal);
    if (result === void 0) {
      result = create6(kernel_default.nextDeviceId(), terminal);
      devices.set(terminal, result);
      this.localDeviceDrivers.add(result);
    }
    return result;
  }
  async handleFiles(stdio) {
    if (stdio.in.kind === "file") {
      await this.handleFileDescriptor(stdio.in, 0);
    }
    if (stdio.out.kind === "file") {
      await this.handleFileDescriptor(stdio.out, 1);
    }
    if (stdio.err.kind === "file") {
      await this.handleFileDescriptor(stdio.err, 2);
    }
  }
  async handleFileDescriptor(descriptor, fd11) {
    const preOpened = Array.from(this.preOpenDirectories.entries());
    for (const entry of preOpened) {
      const mountPoint = entry[0];
      if (mountPoint[mountPoint.length - 1] !== "/") {
        entry[0] = mountPoint + "/";
      }
    }
    preOpened.sort((a, b) => b[0].length - a[0].length);
    for (const preOpenEntry of preOpened) {
      const mountPoint = preOpenEntry[0];
      if (descriptor.path.startsWith(mountPoint)) {
        const driver = preOpenEntry[1];
        const fileDescriptor = await driver.createStdioFileDescriptor(
          Lookupflags.none,
          descriptor.path.substring(mountPoint.length),
          descriptor.openFlags,
          void 0,
          descriptor.openFlags,
          fd11
        );
        this.fileDescriptors.add(fileDescriptor);
        break;
      }
    }
  }
  async handlePipes(stdio) {
    if (stdio.in.kind === "pipeIn") {
      this._stdin = stdio.in.pipe ?? new WritableStream(this.options.encoding);
    }
    if (stdio.out.kind === "pipeOut") {
      this._stdout = stdio.out.pipe ?? new ReadableStream();
    }
    if (stdio.err.kind === "pipeOut") {
      this._stderr = stdio.err.pipe ?? new ReadableStream();
    }
    if (this._stdin === void 0 && this._stdout === void 0 && this._stderr === void 0) {
      return;
    }
    const pipeDevice = create7(kernel_default.nextDeviceId(), this._stdin, this._stdout, this._stderr);
    if (this._stdin !== void 0) {
      this.fileDescriptors.add(pipeDevice.createStdioFileDescriptor(0));
    }
    if (this._stdout !== void 0) {
      this.fileDescriptors.add(pipeDevice.createStdioFileDescriptor(1));
    }
    if (this._stderr !== void 0) {
      this.fileDescriptors.add(pipeDevice.createStdioFileDescriptor(2));
    }
    this.localDeviceDrivers.add(pipeDevice);
  }
};

// src/desktop/process.ts
var NodeServiceConnection = class extends ServiceConnection {
  constructor(wasiService, port, logChannel) {
    super(wasiService, logChannel);
    __publicField(this, "port");
    this.port = port;
    this.port.on("message", (message) => {
      this.handleMessage(message).catch(ral_default().console.error);
    });
  }
  postMessage(message) {
    this.port.postMessage(message);
  }
};
var NodeWasiProcess = class extends WasiProcess {
  constructor(baseUri, programName, module2, memory, options = {}) {
    super(programName, options);
    __publicField(this, "baseUri");
    __publicField(this, "module");
    __publicField(this, "importsMemory");
    __publicField(this, "memoryDescriptor");
    __publicField(this, "memory");
    __publicField(this, "mainWorker");
    __publicField(this, "threadWorkers");
    this.baseUri = baseUri;
    this.threadWorkers = /* @__PURE__ */ new Map();
    this.module = module2 instanceof WebAssembly.Module ? Promise.resolve(module2) : module2;
    if (memory instanceof WebAssembly.Memory) {
      this.memory = memory;
    } else {
      this.memoryDescriptor = memory;
    }
  }
  async startMain(wasiService) {
    const filename = import_vscode12.Uri.joinPath(this.baseUri, "./dist/desktop/mainWorker.js").fsPath;
    this.mainWorker = new import_node_worker_threads.Worker(filename);
    this.mainWorker.on("exit", async (exitCode) => {
      this.cleanUpWorkers().catch((error) => ral_default().console.error(error));
      this.cleanupFileDescriptors().catch((error) => ral_default().console.error(error));
      if (this.state !== "exiting") {
        this.resolveRunPromise(exitCode);
      }
    });
    const connection = new NodeServiceConnection(wasiService, this.mainWorker, this.options.trace);
    await connection.workerReady();
    const module2 = await this.module;
    this.importsMemory = this.doesImportMemory(module2);
    if (this.importsMemory) {
      if (this.memoryDescriptor === void 0) {
        throw new Error("Web assembly imports memory but no memory descriptor was provided.");
      }
      this.memory = new WebAssembly.Memory(this.memoryDescriptor);
    }
    const message = { method: "startMain", module: await this.module, memory: this.memory, trace: this.options.trace !== void 0 };
    connection.postMessage(message);
    return Promise.resolve();
  }
  async startThread(wasiService, tid2, start_arg) {
    if (this.mainWorker === void 0) {
      throw new Error("Main worker not started");
    }
    if (!this.importsMemory || this.memory === void 0) {
      throw new Error("Multi threaded applications need to import shared memory.");
    }
    const filename = import_vscode12.Uri.joinPath(this.baseUri, "./dist/desktop/threadWorker.js").fsPath;
    const worker = new import_node_worker_threads.Worker(filename);
    worker.on("exit", () => {
      this.threadWorkers.delete(tid2);
    });
    const connection = new NodeServiceConnection(wasiService, worker, this.options.trace);
    await connection.workerReady();
    const message = { method: "startThread", module: await this.module, memory: this.memory, tid: tid2, start_arg, trace: this.options.trace !== void 0 };
    connection.postMessage(message);
    this.threadWorkers.set(tid2, worker);
    return Promise.resolve();
  }
  async procExit() {
    await this.mainWorker?.terminate();
    await this.cleanUpWorkers();
    await this.destroyStreams();
    await this.cleanupFileDescriptors();
  }
  async terminate() {
    let result = 0;
    if (this.mainWorker !== void 0) {
      result = await this.mainWorker.terminate();
    }
    await this.cleanUpWorkers();
    await this.destroyStreams();
    await this.cleanupFileDescriptors();
    return result;
  }
  async cleanUpWorkers() {
    for (const worker of this.threadWorkers.values()) {
      await worker.terminate();
    }
    this.threadWorkers.clear();
  }
  async threadEnded(tid2) {
    const worker = this.threadWorkers.get(tid2);
    if (worker !== void 0) {
      this.threadWorkers.delete(tid2);
      await worker.terminate();
    }
  }
  doesImportMemory(module2) {
    const imports = WebAssembly.Module.imports(module2);
    for (const item of imports) {
      if (item.kind === "memory" && item.name === "memory") {
        return true;
      }
    }
    return false;
  }
};

// src/desktop/extension.ts
ril_default.install();
async function activate(context) {
  return new APILoader(context, NodeWasiProcess, async (source) => {
    const bits = await import_vscode13.workspace.fs.readFile(source);
    return WebAssembly.compile(bits);
  });
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
