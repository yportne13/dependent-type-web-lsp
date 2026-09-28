!(function (t, e) {
    for (var r in e) t[r] = e[r];
  })(
    exports,
    (function (t) {
      var e = {};
      function r(n) {
        if (e[n]) return e[n].exports;
        var s = (e[n] = { i: n, l: !1, exports: {} });
        return t[n].call(s.exports, s, s.exports, r), (s.l = !0), s.exports;
      }
      return (
        (r.m = t),
        (r.c = e),
        (r.d = function (t, e, n) {
          r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
        }),
        (r.r = function (t) {
          'undefined' != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
            Object.defineProperty(t, '__esModule', { value: !0 });
        }),
        (r.t = function (t, e) {
          if ((1 & e && (t = r(t)), 8 & e)) return t;
          if (4 & e && 'object' == typeof t && t && t.__esModule) return t;
          var n = Object.create(null);
          if (
            (r.r(n),
            Object.defineProperty(n, 'default', { enumerable: !0, value: t }),
            2 & e && 'string' != typeof t)
          )
            for (var s in t)
              r.d(
                n,
                s,
                function (e) {
                  return t[e];
                }.bind(null, s)
              );
          return n;
        }),
        (r.n = function (t) {
          var e =
            t && t.__esModule
              ? function () {
                  return t.default;
                }
              : function () {
                  return t;
                };
          return r.d(e, 'a', e), e;
        }),
        (r.o = function (t, e) {
          return Object.prototype.hasOwnProperty.call(t, e);
        }),
        (r.p = ''),
        r((r.s = 1))
      );
    })([
      function (t, e) {
        t.exports = require('vscode');
      },
      function (t, e, r) {
        'use strict';
        var n =
          (this && this.__awaiter) ||
          function (t, e, r, n) {
            return new (r || (r = Promise))(function (s, i) {
              function o(t) {
                try {
                  l(n.next(t));
                } catch (t) {
                  i(t);
                }
              }
              function a(t) {
                try {
                  l(n.throw(t));
                } catch (t) {
                  i(t);
                }
              }
              function l(t) {
                var e;
                t.done
                  ? s(t.value)
                  : ((e = t.value),
                    e instanceof r
                      ? e
                      : new r(function (t) {
                          t(e);
                        })).then(o, a);
              }
              l((n = n.apply(t, e || [])).next());
            });
          };
        Object.defineProperty(e, '__esModule', { value: !0 }),
          (e.activate = void 0);
        const s = r(0),
          i = r(2);
        function o(t, e) {
          t && '/sample-folder/large.ts' === t.fileName
            ? e.set(t.uri, [
                {
                  code: '',
                  message:
                    'cannot assign twice to immutable variable `storeHouses`',
                  range: new s.Range(
                    new s.Position(4, 12),
                    new s.Position(4, 32)
                  ),
                  severity: s.DiagnosticSeverity.Error,
                  source: '',
                  relatedInformation: [
                    new s.DiagnosticRelatedInformation(
                      new s.Location(
                        t.uri,
                        new s.Range(new s.Position(1, 8), new s.Position(1, 9))
                      ),
                      'first assignment to `x`'
                    ),
                  ],
                },
                {
                  code: '',
                  message: 'function does not follow naming conventions',
                  range: new s.Range(
                    new s.Position(7, 10),
                    new s.Position(7, 23)
                  ),
                  severity: s.DiagnosticSeverity.Warning,
                  source: '',
                },
              ])
            : e.clear();
        }
        e.activate = function (t) {
          if ('object' == typeof navigator) {
            (function (t) {
              const e = new i.MemFS();
              return t.subscriptions.push(e), e;
            })(t).seed(),
              (function (t) {
                const e = s.languages.createDiagnosticCollection('test');
                s.window.activeTextEditor &&
                  o(s.window.activeTextEditor.document, e);
                t.subscriptions.push(
                  s.window.onDidChangeActiveTextEditor((t) => {
                    t && o(t.document, e);
                  })
                );
              })(t),
              (function () {
                class t {
                  constructor(t) {
                    this.workspaceRoot = t;
                  }
                  provideTasks() {
                    return n(this, void 0, void 0, function* () {
                      return this.getTasks();
                    });
                  }
                  resolveTask(t) {
                    if (t.definition.flavor) {
                      const e = t.definition;
                      return this.getTask(e.flavor, e.flags ? e.flags : [], e);
                    }
                  }
                  getTasks() {
                    if (void 0 !== this.tasks) return this.tasks;
                    const t = [['watch', 'incremental'], ['incremental'], []];
                    return (
                      (this.tasks = []),
                      ['32', '64'].forEach((e) => {
                        t.forEach((t) => {
                          this.tasks.push(this.getTask(e, t));
                        });
                      }),
                      this.tasks
                    );
                  }
                  getTask(r, i, o) {
                    return (
                      void 0 === o &&
                        (o = {
                          type: t.CustomBuildScriptType,
                          flavor: r,
                          flags: i,
                        }),
                      new s.Task(
                        o,
                        s.TaskScope.Workspace,
                        `${r} ${i.join(' ')}`,
                        t.CustomBuildScriptType,
                        new s.CustomExecution(() =>
                          n(this, void 0, void 0, function* () {
                            return new e(
                              this.workspaceRoot,
                              r,
                              i,
                              () => this.sharedState,
                              (t) => (this.sharedState = t)
                            );
                          })
                        )
                      )
                    );
                  }
                }
                t.CustomBuildScriptType = 'custombuildscript';
                class e {
                  constructor(t, e, r, n, i) {
                    (this.workspaceRoot = t),
                      (this.flags = r),
                      (this.getSharedState = n),
                      (this.setSharedState = i),
                      (this.writeEmitter = new s.EventEmitter()),
                      (this.onDidWrite = this.writeEmitter.event),
                      (this.closeEmitter = new s.EventEmitter()),
                      (this.onDidClose = this.closeEmitter.event);
                  }
                  open(t) {
                    if (this.flags.indexOf('watch') > -1) {
                      let t = this.workspaceRoot + '/customBuildFile';
                      (this.fileWatcher = s.workspace.createFileSystemWatcher(t)),
                        this.fileWatcher.onDidChange(() => this.doBuild()),
                        this.fileWatcher.onDidCreate(() => this.doBuild()),
                        this.fileWatcher.onDidDelete(() => this.doBuild());
                    }
                    this.doBuild();
                  }
                  close() {
                    this.fileWatcher && this.fileWatcher.dispose();
                  }
                  doBuild() {
                    return n(this, void 0, void 0, function* () {
                      return new Promise((t) => {
                        this.writeEmitter.fire('Starting build...\r\n');
                        let e = this.flags.indexOf('incremental') > -1;
                        e &&
                          (this.getSharedState()
                            ? this.writeEmitter.fire(
                                'Using last build results: ' +
                                  this.getSharedState() +
                                  '\r\n'
                              )
                            : ((e = !1),
                              this.writeEmitter.fire(
                                'No result from last build. Doing full build.\r\n'
                              ))),
                          setTimeout(
                            () => {
                              const e = new Date();
                              this.setSharedState(
                                e.toTimeString() + ' ' + e.toDateString()
                              ),
                                this.writeEmitter.fire('Build complete.\r\n\r\n'),
                                -1 === this.flags.indexOf('watch') &&
                                  (this.closeEmitter.fire(), t());
                            },
                            e ? 1e3 : 4e3
                          );
                      });
                    });
                  }
                }
                s.tasks.registerTaskProvider(
                  t.CustomBuildScriptType,
                  new t(s.workspace.rootPath)
                );
              })(),
              s.commands.executeCommand(
                'vscode.open',
                s.Uri.parse('memfs:/sample-folder/typeclass_complex.typort')
              );
          }
        };
      },
      function (t, e, r) {
        'use strict';
        Object.defineProperty(e, '__esModule', { value: !0 }),
          (e.MemFS = e.Directory = e.File = void 0);
        const n = r(0),
          s = r(3);
        class i {
          constructor(t, e) {
            (this.uri = t),
              (this.type = n.FileType.File),
              (this.ctime = Date.now()),
              (this.mtime = Date.now()),
              (this.size = 0),
              (this.name = e);
          }
        }
        e.File = i;
        class o {
          constructor(t, e) {
            (this.uri = t),
              (this.type = n.FileType.Directory),
              (this.ctime = Date.now()),
              (this.mtime = Date.now()),
              (this.size = 0),
              (this.name = e),
              (this.entries = new Map());
          }
        }
        e.Directory = o;
        const a = new TextEncoder();
        class l {
          constructor() {
            (this.root = new o(n.Uri.parse('memfs:/'), '')),
              (this._emitter = new n.EventEmitter()),
              (this._bufferedEvents = []),
              (this.onDidChangeFile = this._emitter.event),
              (this._textDecoder = new TextDecoder()),
              (this.disposable = n.Disposable.from(
                n.workspace.registerFileSystemProvider(l.scheme, this, {
                  isCaseSensitive: !0,
                }),
                n.workspace.registerFileSearchProvider(l.scheme, this),
                n.workspace.registerTextSearchProvider(l.scheme, this)
              ));
          }
          dispose() {
            var t;
            null === (t = this.disposable) || void 0 === t || t.dispose();
          }
          seed() {
            this.createDirectory(n.Uri.parse('memfs:/sample-folder/')),
              this.createDirectory(n.Uri.parse('memfs:/sample-folder/hdl/')),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/typeclass_complex.typort'),
                a.encode(s.file_typeclass_complex),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/theorem_proving.typort'),
                a.encode(s.file_theorem_proving),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/alu.typort'),
                a.encode(s.file_alu),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl_ops.typort'),
                a.encode(s.file_hdl_ops),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/01-basics.typort'),
                a.encode(s.file_hdl_01_basics),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/02-arithmetic.typort'),
                a.encode(s.file_hdl_02_arithmetic),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/03-bitwise.typort'),
                a.encode(s.file_hdl_03_bitwise),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/04-compare.typort'),
                a.encode(s.file_hdl_04_compare),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/05-bool.typort'),
                a.encode(s.file_hdl_05_bool),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/06-select-cat.typort'),
                a.encode(s.file_hdl_06_select_cat),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/07-registers.typort'),
                a.encode(s.file_hdl_07_registers),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/08-control-flow.typort'),
                a.encode(s.file_hdl_08_control_flow),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/09-hierarchy.typort'),
                a.encode(s.file_hdl_09_hierarchy),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/10-bundle.typort'),
                a.encode(s.file_hdl_10_bundle),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/adder_proof.typort'),
                a.encode(s.file_adder_proof),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/12-memory.typort'),
                a.encode(s.file_hdl_12_memory),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/13-adder-tree.typort'),
                a.encode(s.file_hdl_13_adder_tree),
                { create: !0, overwrite: !0 }
              ),              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/11-bundle-deep.typort'),
                a.encode(s.file_hdl_11_bundle_deep),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/14-arithmetic-extra.typort'),
                a.encode(s.file_hdl_14_arithmetic_extra),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/15-inout.typort'),
                a.encode(s.file_hdl_15_inout),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/16-counter.typort'),
                a.encode(s.file_hdl_16_counter),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/17-output-reg.typort'),
                a.encode(s.file_hdl_17_output_reg),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/18-utils.typort'),
                a.encode(s.file_hdl_18_utils),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/19-stream.typort'),
                a.encode(s.file_hdl_19_stream),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/20-misc.typort'),
                a.encode(s.file_hdl_20_misc),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/21-crossclock.typort'),
                a.encode(s.file_hdl_21_crossclock),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/22-widthadapter.typort'),
                a.encode(s.file_hdl_22_widthadapter),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/23-verilog-compat.typort'),
                a.encode(s.file_hdl_23_verilog_compat),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/24-verilog-practice.typort'),
                a.encode(s.file_hdl_24_verilog_practice),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/25-verilog-reset.typort'),
                a.encode(s.file_hdl_25_verilog_reset),
                { create: !0, overwrite: !0 }
              );

          }
          stat(t) {
            return this._lookup(t, !1);
          }
          readDirectory(t) {
            const e = this._lookupAsDirectory(t, !1);
            let r = [];
            for (const [t, n] of e.entries) r.push([t, n.type]);
            return r;
          }
          readFile(t) {
            const e = this._lookupAsFile(t, !1).data;
            if (e) return e;
            throw n.FileSystemError.FileNotFound();
          }
          writeFile(t, e, r) {
            let s = this._basename(t.path),
              a = this._lookupParentDirectory(t),
              l = a.entries.get(s);
            if (l instanceof o) throw n.FileSystemError.FileIsADirectory(t);
            if (!l && !r.create) throw n.FileSystemError.FileNotFound(t);
            if (l && r.create && !r.overwrite)
              throw n.FileSystemError.FileExists(t);
            l ||
              ((l = new i(t, s)),
              a.entries.set(s, l),
              this._fireSoon({ type: n.FileChangeType.Created, uri: t })),
              (l.mtime = Date.now()),
              (l.size = e.byteLength),
              (l.data = e),
              this._fireSoon({ type: n.FileChangeType.Changed, uri: t });
          }
          rename(t, e, r) {
            if (!r.overwrite && this._lookup(e, !0))
              throw n.FileSystemError.FileExists(e);
            let s = this._lookup(t, !1),
              i = this._lookupParentDirectory(t),
              o = this._lookupParentDirectory(e),
              a = this._basename(e.path);
            i.entries.delete(s.name),
              (s.name = a),
              o.entries.set(a, s),
              this._fireSoon(
                { type: n.FileChangeType.Deleted, uri: t },
                { type: n.FileChangeType.Created, uri: e }
              );
          }
          delete(t) {
            let e = t.with({ path: this._dirname(t.path) }),
              r = this._basename(t.path),
              s = this._lookupAsDirectory(e, !1);
            if (!s.entries.has(r)) throw n.FileSystemError.FileNotFound(t);
            s.entries.delete(r),
              (s.mtime = Date.now()),
              (s.size -= 1),
              this._fireSoon(
                { type: n.FileChangeType.Changed, uri: e },
                { uri: t, type: n.FileChangeType.Deleted }
              );
          }
          createDirectory(t) {
            let e = this._basename(t.path),
              r = t.with({ path: this._dirname(t.path) }),
              s = this._lookupAsDirectory(r, !1),
              i = new o(t, e);
            s.entries.set(i.name, i),
              (s.mtime = Date.now()),
              (s.size += 1),
              this._fireSoon(
                { type: n.FileChangeType.Changed, uri: r },
                { type: n.FileChangeType.Created, uri: t }
              );
          }
          _lookup(t, e) {
            let r = t.path.split('/'),
              s = this.root;
            for (const i of r) {
              if (!i) continue;
              let r;
              if ((s instanceof o && (r = s.entries.get(i)), !r)) {
                if (e) return;
                throw n.FileSystemError.FileNotFound(t);
              }
              s = r;
            }
            return s;
          }
          _lookupAsDirectory(t, e) {
            let r = this._lookup(t, e);
            if (r instanceof o) return r;
            throw n.FileSystemError.FileNotADirectory(t);
          }
          _lookupAsFile(t, e) {
            let r = this._lookup(t, e);
            if (r instanceof i) return r;
            throw n.FileSystemError.FileIsADirectory(t);
          }
          _lookupParentDirectory(t) {
            const e = t.with({ path: this._dirname(t.path) });
            return this._lookupAsDirectory(e, !1);
          }
          watch(t) {
            return new n.Disposable(() => {});
          }
          _fireSoon(...t) {
            this._bufferedEvents.push(...t),
              this._fireSoonHandle && clearTimeout(this._fireSoonHandle),
              (this._fireSoonHandle = setTimeout(() => {
                this._emitter.fire(this._bufferedEvents),
                  (this._bufferedEvents.length = 0);
              }, 5));
          }
          _basename(t) {
            return (t = this._rtrim(t, '/'))
              ? t.substr(t.lastIndexOf('/') + 1)
              : '';
          }
          _dirname(t) {
            return (t = this._rtrim(t, '/'))
              ? t.substr(0, t.lastIndexOf('/'))
              : '/';
          }
          _rtrim(t, e) {
            if (!t || !e) return t;
            const r = e.length,
              n = t.length;
            if (0 === r || 0 === n) return t;
            let s = n,
              i = -1;
            for (; (i = t.lastIndexOf(e, s - 1)), -1 !== i && i + r === s; ) {
              if (0 === i) return '';
              s = i;
            }
            return t.substring(0, s);
          }
          _getFiles() {
            const t = new Set();
            return this._doGetFiles(this.root, t), t;
          }
          _doGetFiles(t, e) {
            t.entries.forEach((t) => {
              t instanceof i ? e.add(t) : this._doGetFiles(t, e);
            });
          }
          _convertSimple2RegExpPattern(t) {
            return t
              .replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&')
              .replace(/[\*]/g, '.*');
          }
          provideFileSearchResults(t, e, r) {
            return this._findFiles(t.pattern);
          }
          _findFiles(t) {
            const e = this._getFiles(),
              r = [],
              n = t ? new RegExp(this._convertSimple2RegExpPattern(t)) : null;
            for (const t of e) (n && !n.exec(t.name)) || r.push(t.uri);
            return r;
          }
          provideTextSearchResults(t, e, r, s) {
            const i = this._findFiles(e.includes[0]);
            if (i)
              for (const e of i) {
                const s = this._textDecoder.decode(this.readFile(e)).split('\n');
                for (let i = 0; i < s.length; i++) {
                  const o = s[i],
                    a = o.indexOf(t.pattern);
                  -1 !== a &&
                    r.report({
                      uri: e,
                      ranges: new n.Range(
                        new n.Position(i, a),
                        new n.Position(i, a + t.pattern.length)
                      ),
                      preview: {
                        text: o,
                        matches: new n.Range(
                          new n.Position(0, a),
                          new n.Position(0, a + t.pattern.length)
                        ),
                      },
                    });
                }
              }
            return { limitHit: !1 };
          }
        }
        (e.MemFS = l), (l.scheme = 'memfs');
      },
      function (t, e, r) {
        'use strict';
        Object.defineProperty(e, '__esModule', { value: !0 }),
          (e.gbkFile =
            e.windows1251File =
            e.getImageFile =
            e.debuggableFile =
            e.largeTSFile =
              void 0),
          (e.largeTSFile =
            "/// <reference path=\"lib/Geometry.ts\"/>\n/// <reference path=\"Game.ts\"/>\n\nmodule Mankala {\nexport var storeHouses = [6,13];\nexport var svgNS = 'http://www.w3.org/2000/svg';\n\nfunction createSVGRect(r:Rectangle) {\n\tvar rect = document.createElementNS(svgNS,'rect');\n\trect.setAttribute('x', r.x.toString());\n\trect.setAttribute('y', r.y.toString());\n\trect.setAttribute('width', r.width.toString());\n\trect.setAttribute('height', r.height.toString());\n\treturn rect;\n}\n\nfunction createSVGEllipse(r:Rectangle) {\n\tvar ell = document.createElementNS(svgNS,'ellipse');\n\tell.setAttribute('rx',(r.width/2).toString());\n\tell.setAttribute('ry',(r.height/2).toString());\n\tell.setAttribute('cx',(r.x+r.width/2).toString());\n\tell.setAttribute('cy',(r.y+r.height/2).toString());\n\treturn ell;\n}\n\nfunction createSVGEllipsePolar(angle:number,radius:number,tx:number,ty:number,cxo:number,cyo:number) {\n\tvar ell = document.createElementNS(svgNS,'ellipse');\n\tell.setAttribute('rx',radius.toString());\n\tell.setAttribute('ry',(radius/3).toString());\n\tell.setAttribute('cx',cxo.toString());\n\tell.setAttribute('cy',cyo.toString());\n\tvar dangle = angle*(180/Math.PI);\n\tell.setAttribute('transform','rotate('+dangle+','+cxo+','+cyo+') translate('+tx+','+ty+')');\n\treturn ell;\n}\n\nfunction createSVGInscribedCircle(sq:Square) {\n\tvar circle = document.createElementNS(svgNS,'circle');\n\tcircle.setAttribute('r',(sq.length/2).toString());\n\tcircle.setAttribute('cx',(sq.x+(sq.length/2)).toString());\n\tcircle.setAttribute('cy',(sq.y+(sq.length/2)).toString());\n\treturn circle;\n}\n\nexport class Position {\n\n\tseedCounts:number[];\n\tstartMove:number;\n\tturn:number;\n\n\tconstructor(seedCounts:number[],startMove:number,turn:number) {\n\t\tthis.seedCounts = seedCounts;\n\t\tthis.startMove = startMove;\n\t\tthis.turn = turn;\n\t}\n\n\tscore() {\n\t\tvar baseScore = this.seedCounts[storeHouses[1-this.turn]]-this.seedCounts[storeHouses[this.turn]];\n\t\tvar otherSpaces = homeSpaces[this.turn];\n\t\tvar sum = 0;\n\t\tfor (var k = 0,len = otherSpaces.length;k<len;k++) {\n\t\t\tsum += this.seedCounts[otherSpaces[k]];\n\t\t}\n\t\tif (sum==0) {\n\t\t\tvar mySpaces = homeSpaces[1-this.turn];\n\t\t\tvar mySum = 0;\n\t\t\tfor (var j = 0,len = mySpaces.length;j<len;j++) {\n\t\t\t\tmySum += this.seedCounts[mySpaces[j]];\n\t\t\t}\n\n\t\t\tbaseScore -= mySum;\n\t\t}\n\t\treturn baseScore;\n\t}\n\n\tmove(space:number,nextSeedCounts:number[],features:Features):boolean {\n\t\tif ((space==storeHouses[0])||(space==storeHouses[1])) {\n\t\t\t// can't move seeds in storehouse\n\t\t\treturn false;\n\t\t}\n\t\tif (this.seedCounts[space]>0) {\n\t\t\tfeatures.clear();\n\t\t\tvar len = this.seedCounts.length;\n\t\t\tfor (var i = 0;i<len;i++) {\n\t\t\t\tnextSeedCounts[i] = this.seedCounts[i];\n\t\t\t}\n\t\t\tvar seedCount = this.seedCounts[space];\n\t\t\tnextSeedCounts[space] = 0;\n\t\t\tvar nextSpace = (space+1)%14;\n\n\t\t\twhile (seedCount>0) {\n\t\t\t\tif (nextSpace==storeHouses[this.turn]) {\n\t\t\t\t\tfeatures.seedStoredCount++;\n\t\t\t\t}\n\t\t\t\tif ((nextSpace!=storeHouses[1-this.turn])) {\n\t\t\t\t\tnextSeedCounts[nextSpace]++;\n\t\t\t\t\tseedCount--;\n\t\t\t\t}\n\t\t\t\tif (seedCount==0) {\n\t\t\t\t\tif (nextSpace==storeHouses[this.turn]) {\n\t\t\t\t\t\tfeatures.turnContinues = true;\n\t\t\t\t\t}\n\t\t\t\t\telse {\n\t\t\t\t\t\tif ((nextSeedCounts[nextSpace]==1)&&\n\t\t\t\t\t\t\t(nextSpace>=firstHomeSpace[this.turn])&&\n\t\t\t\t\t\t\t(nextSpace<=lastHomeSpace[this.turn])) {\n\t\t\t\t\t\t\t// capture\n\t\t\t\t\t\t\tvar capturedSpace = capturedSpaces[nextSpace];\n\t\t\t\t\t\t\tif (capturedSpace>=0) {\n\t\t\t\t\t\t\t\tfeatures.spaceCaptured = capturedSpace;\n\t\t\t\t\t\t\t\tfeatures.capturedCount = nextSeedCounts[capturedSpace];\n\t\t\t\t\t\t\t\tnextSeedCounts[capturedSpace] = 0;\n\t\t\t\t\t\t\t\tnextSeedCounts[storeHouses[this.turn]] += features.capturedCount;\n\t\t\t\t\t\t\t\tfeatures.seedStoredCount += nextSeedCounts[capturedSpace];\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tnextSpace = (nextSpace+1)%14;\n\t\t\t}\n\t\t\treturn true;\n\t\t}\n\t\telse {\n\t\t\treturn false;\n\t\t}\n\t}\n}\n\nexport class SeedCoords {\n\ttx:number;\n\tty:number;\n\tangle:number;\n\n\tconstructor(tx:number, ty:number, angle:number) {\n\t\tthis.tx = tx;\n\t\tthis.ty = ty;\n\t\tthis.angle = angle;\n\t}\n}\n\nexport class DisplayPosition extends Position {\n\n\tconfig:SeedCoords[][];\n\n\tconstructor(seedCounts:number[],startMove:number,turn:number) {\n\t\tsuper(seedCounts,startMove,turn);\n\n\t\tthis.config = [];\n\n\t\tfor (var i = 0;i<seedCounts.length;i++) {\n\t\t\tthis.config[i] = new Array<SeedCoords>();\n\t\t}\n\t}\n\n\n\tseedCircleRect(rect:Rectangle,seedCount:number,board:Element,seed:number) {\n\t\tvar coords = this.config[seed];\n\t\tvar sq = rect.inner(0.95).square();\n\t\tvar cxo = (sq.width/2)+sq.x;\n\t\tvar cyo = (sq.height/2)+sq.y;\n\t\tvar seedNumbers = [5,7,9,11];\n\t\tvar ringIndex = 0;\n\t\tvar ringRem = seedNumbers[ringIndex];\n\t\tvar angleDelta = (2*Math.PI)/ringRem;\n\t\tvar angle = angleDelta;\n\t\tvar seedLength = sq.width/(seedNumbers.length<<1);\n\t\tvar crMax = sq.width/2-(seedLength/2);\n\t\tvar pit = createSVGInscribedCircle(sq);\n\t\tif (seed<7) {\n\t\t\tpit.setAttribute('fill','brown');\n\t\t}\n\t\telse {\n\t\t\tpit.setAttribute('fill','saddlebrown');\n\t\t}\n\t\tboard.appendChild(pit);\n\t\tvar seedsSeen = 0;\n\t\twhile (seedCount > 0) {\n\t\t\tif (ringRem == 0) {\n\t\t\t\tringIndex++;\n\t\t\t\tringRem = seedNumbers[ringIndex];\n\t\t\t\tangleDelta = (2*Math.PI)/ringRem;\n\t\t\t\tangle = angleDelta;\n\t\t\t}\n\t\t\tvar tx:number;\n\t\t\tvar ty:number;\n\t\t\tvar tangle = angle;\n\t\t\tif (coords.length>seedsSeen) {\n\t\t\t\ttx = coords[seedsSeen].tx;\n\t\t\t\tty = coords[seedsSeen].ty;\n\t\t\t\ttangle = coords[seedsSeen].angle;\n\t\t\t}\n\t\t\telse {\n\t\t\t\ttx = (Math.random()*crMax)-(crMax/3);\n\t\t\t\tty = (Math.random()*crMax)-(crMax/3);\n\t\t\t\tcoords[seedsSeen] = new SeedCoords(tx,ty,angle);\n\t\t\t}\n\t\t\tvar ell = createSVGEllipsePolar(tangle,seedLength,tx,ty,cxo,cyo);\n\t\t\tboard.appendChild(ell);\n\t\t\tangle += angleDelta;\n\t\t\tringRem--;\n\t\t\tseedCount--;\n\t\t\tseedsSeen++;\n\t\t}\n\t}\n\n\ttoCircleSVG() {\n\t\tvar seedDivisions = 14;\n\t\tvar board = document.createElementNS(svgNS,'svg');\n\t\tvar boardRect = new Rectangle(0,0,1800,800);\n\t\tboard.setAttribute('width','1800');\n\t\tboard.setAttribute('height','800');\n\t\tvar whole = createSVGRect(boardRect);\n\t\twhole.setAttribute('fill','tan');\n\t\tboard.appendChild(whole);\n\t\tvar labPlayLab = boardRect.proportionalSplitVert(20,760,20);\n\t\tvar playSurface = labPlayLab[1];\n\t\tvar storeMainStore = playSurface.proportionalSplitHoriz(8,48,8);\n\t\tvar mainPair = storeMainStore[1].subDivideVert(2);\n\t\tvar playerRects = [mainPair[0].subDivideHoriz(6), mainPair[1].subDivideHoriz(6)];\n\t\t// reverse top layer because storehouse on left\n\t\tfor (var k = 0;k<3;k++) {\n\t\t\tvar temp = playerRects[0][k];\n\t\t\tplayerRects[0][k] = playerRects[0][5-k];\n\t\t\tplayerRects[0][5-k] = temp;\n\t\t}\n\t\tvar storehouses = [storeMainStore[0],storeMainStore[2]];\n\t\tvar playerSeeds = this.seedCounts.length>>1;\n\t\tfor (var i = 0;i<2;i++) {\n\t\t\tvar player = playerRects[i];\n\t\t\tvar storehouse = storehouses[i];\n\t\t\tvar r:Rectangle;\n\t\t\tfor (var j = 0;j<playerSeeds;j++) {\n\t\t\t\tvar seed = (i*playerSeeds)+j;\n\t\t\t\tvar seedCount = this.seedCounts[seed];\n\t\t\t\tif (j==(playerSeeds-1)) {\n\t\t\t\t\tr = storehouse;\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\tr = player[j];\n\t\t\t\t}\n\t\t\t\tthis.seedCircleRect(r,seedCount,board,seed);\n\t\t\t\tif (seedCount==0) {\n\t\t\t\t\t// clear\n\t\t\t\t\tthis.config[seed] = new Array<SeedCoords>();\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn board;\n\t}\n}\n}\n"),
          (e.file_theorem_proving =
            `

// ============================================================
// Theorem Proving Examples
// Complex proofs using Eq, lemmas from the prelude, and
// compositional reasoning with trans, symm, cong, and subst.
// ============================================================

// -------------------------------------------------------
// 1. Identity: proving that n + 0 = 0 + n = n
//    add_zero_right(n): Eq(n + 0, n)     [by rfl — definitional]
//    add_zero_left(n):  Eq(0 + n, n)     [by induction]
// -------------------------------------------------------

// 1a. Using trans + symm: 0 + n = n + 0
def zero_add_comm(n: Nat): Eq(0 + n, n + 0) =
    trans(add_zero_left(n), symm(add_zero_right(n)))

println(zero_add_comm(5))

// -------------------------------------------------------
// Calc variants: each \`def <name>_calc ... = calc { ... }\`
// re-proves the same proposition as its non-calc original
// using the calc chain syntax \`lhs = rhs by proof\`
// (see docs/calc-reasoning-design.md). Each variant sits
// directly below its original and prints the same value.
// -------------------------------------------------------

// 1a-calc: zero_add_comm via a two-step chain
//   0 + n = n     by add_zero_left(n)
//   n     = n + 0 by symm(add_zero_right(n))
def zero_add_comm_calc(n: Nat): Eq(0 + n, n + 0) =
    calc {
        0 + n = n by add_zero_left(n)
        n = n + 0 by symm(add_zero_right(n))
    }

println(zero_add_comm_calc(5))

// 1b. Direct: n + 0 = n (already provided by prelude as add_zero_right)
def identity_right(n: Nat): Eq(n + 0, n) = add_zero_right(n)
println(identity_right(3))

// -------------------------------------------------------
// 2. succ is injective: if succ(a) = succ(b) then a = b
//    Proof: use pred on both sides via cong
// -------------------------------------------------------

// pred(succ(n)) = n by definition, so:
// Given e: Eq(succ(a), succ(b))
// cong(pred, e): Eq(pred(succ(a)), pred(succ(b))) = Eq(a, b)
def succ_injective[a: Nat, b: Nat](e: Eq(succ(a), succ(b))): Eq(a, b) =
    cong(pred, e)

// Example usage
def succ_inj_eg: Eq(3, 3) = succ_injective(refl(succ(3)))
println(succ_inj_eg)

// -------------------------------------------------------
// 3. n + 1 = succ(n)
//    add_succ_right(n, 0): Eq(n + succ(0), succ(n + 0))
//    Since 1 = succ(0) and n + 0 = n via add_zero_right(n):
//    trans( add_succ_right(n, 0), cong(succ, add_zero_right(n)) )
// -------------------------------------------------------

def add_one_succ(n: Nat): Eq(n + 1, succ(n)) =
    let step1: Eq(n + 1, succ(n + 0)) = add_succ_right(n, 0);
    let step2: Eq(succ(n + 0), succ(n)) = cong(succ, add_zero_right(n));
    trans(step1, step2)

println(add_one_succ(3))

// 3-calc: add_one_succ via the same two trans steps as the original
//   n + 1       = succ(n + 0) by add_succ_right(n, 0)
//   succ(n + 0) = succ(n)     by cong(succ, add_zero_right(n))
def add_one_succ_calc(n: Nat): Eq(n + 1, succ(n)) =
    calc {
        n + 1 = succ(n + 0) by add_succ_right(n, 0)
        succ(n + 0) = succ(n) by cong(succ, add_zero_right(n))
    }

println(add_one_succ_calc(3))

// -------------------------------------------------------
// 4. double(n) = n + n
//    double is defined as n + n, so this is rfl
// -------------------------------------------------------

def double_eq_add_self(n: Nat): Eq(double(n), n + n) = rfl
println(double_eq_add_self(4))

// -------------------------------------------------------
// 5. Composition: if a = b = c = d then a = d
//    Chain multiple proofs via trans
// -------------------------------------------------------

// add_comm(3, 5): Eq(3+5, 5+3)
// We want Eq(3+5, (5+2)+1)... hmm, need to think of a concrete example.
//
// add_comm(2, 3): Eq(2+3, 3+2)   — both are 5
// add_assoc(1, 1, 3): Eq(1+1+3, 1+(1+3))
// But we need these to be connected...

// Simpler: Chain three theorems about the same expression
// add_zero_right(7): Eq(7+0, 7)
// symm(add_zero_left(7)): Eq(7, 0+7)
// Then Eq(7+0, 0+7):
def chain_eg: Eq(7 + 0, 0 + 7) =
    trans(add_zero_right(7), symm(add_zero_left(7)))

println(chain_eg)

// 5-calc: chain_eg via a two-step chain
//   7 + 0 = 7     by add_zero_right(7)
//   7     = 0 + 7 by symm(add_zero_left(7))
def chain_eg_calc: Eq(7 + 0, 0 + 7) =
    calc {
        7 + 0 = 7 by add_zero_right(7)
        7 = 0 + 7 by symm(add_zero_left(7))
    }

println(chain_eg_calc)

// -------------------------------------------------------
// 6. Congruence with binary functions via nested cong
//    If a = a' and b = b' then f(a, b) = f(a', b')
//    Requires nested application of cong
// -------------------------------------------------------

// Step 1: cong(\\x. add(x, b), e1): Eq(add(a, b), add(a', b))
// Step 2: cong(\\y. add(a', y), e2): Eq(add(a', b), add(a', b'))
// Step 3: trans(step1, step2)

def add_cong(a: Nat, a2: Nat, b: Nat, b2: Nat,
             e1: Eq(a, a2), e2: Eq(b, b2)): Eq(a + b, a2 + b2) =
    let step1: Eq(a + b, a2 + b) = cong(x => x + b, e1);
    let step2: Eq(a2 + b, a2 + b2) = cong(x => a2 + x, e2);
    trans(step1, step2)

// add_comm(1, 6): Eq(1+6, 6+1) = Eq(7, 7)  — just a proof of refl(7) via comm
// So add_cong(1, 6, 2, 4, add_comm(1, 6)...) won't type-check since types differ.
//
// Use simpler: refl values
def add_cong_eg: Eq(3 + 5, 3 + 5) = add_cong(3, 3, 5, 5, rfl, rfl)
println(add_cong_eg)

// For non-trivial: add_cong with symm of add_zero
// add_zero_right(5): Eq(5+0, 5), add_zero_left(3): Eq(0+3, 3)
// But 5+0 ≠ 0+3... wrong types again.
//
// add_zero_right(5): Eq(5+0, 5) means a=5+0, a2=5
// add_zero_left(7): Eq(0+7, 7) means b=0+7, b2=7
// So add_cong(5+0, 5, 0+7, 7, add_zero_right(5), add_zero_left(7)):
//   Eq((5+0)+(0+7), 5+7)
def add_cong_complex: Eq((5 + 0) + (0 + 7), 5 + 7) =
    add_cong(5+0, 5, 0+7, 7, add_zero_right(5), add_zero_left(7))

println(add_cong_complex)

// 6-calc: add_cong_complex via a two-step chain (the two nested cong
//   steps of add_cong, inlined)
//   (5 + 0) + (0 + 7) = 5 + (0 + 7) by cong(x => x + (0 + 7), add_zero_right(5))
//   5 + (0 + 7)       = 5 + 7       by cong(x => 5 + x, add_zero_left(7))
def add_cong_complex_calc: Eq((5 + 0) + (0 + 7), 5 + 7) =
    calc {
        (5 + 0) + (0 + 7) = 5 + (0 + 7) by cong(x => x + (0 + 7), add_zero_right(5))
        5 + (0 + 7) = 5 + 7 by cong(x => 5 + x, add_zero_left(7))
    }

println(add_cong_complex_calc)

// -------------------------------------------------------
// 7. Proof of add_succ_left via induction
//    add_succ_left(n, m): Eq(succ(n) + m, succ(n + m))
//    This is already in the prelude. We just show its usage.
// -------------------------------------------------------

def add_succ_left_eg(n: Nat, m: Nat): Eq(succ(n) + m, succ(n + m)) =
    add_succ_left(n, m)

println(add_succ_left_eg(2, 3))

// -------------------------------------------------------
// 8. Relationship: double(n) + double(m) = double(n + m)
//    double(n) = n + n
//    So (n+n) + (m+m) = (n+m) + (n+m) = double(n + m)
//    This requires add_assoc and add_comm to rearrange.
//
//    (n+n) + (m+m)
//    = n + (n + (m + m))          by add_assoc(n, n, m+m)
//    = n + ((n + m) + m)          by add_assoc(n, m, m) moving parens + add_comm
//    = n + ((m + n) + m)          by add_comm(n, m)
//    ... this gets complex. Let's simplify.
// -------------------------------------------------------

// Simpler: double(n + m) = (n + m) + (n + m) by definition
// And (n + n) + (m + m) = (n + m) + (n + m) requires comm/assoc
// Let's prove a simpler lemma: (a + b) + c = (a + c) + b
// Using add_assoc + add_comm(b, c) + add_assoc
def add_permute(a: Nat, b: Nat, c: Nat): Eq((a + b) + c, (a + c) + b) =
    let lhs: Eq((a + b) + c, a + (b + c)) = add_assoc(a, b, c);
    let mid: Eq(a + (b + c), a + (c + b)) = cong(x => a + x, add_comm(b, c));
    let rhs: Eq(a + (c + b), (a + c) + b) = symm(add_assoc(a, c, b));
    trans(trans(lhs, mid), rhs)

println(add_permute(1, 2, 3))

// 8-calc: add_permute via a three-step chain (mirrors calc_three_step)
//   (a + b) + c = a + (b + c)     by add_assoc(a, b, c)
//   a + (b + c) = a + (c + b)     by cong(x => a + x, add_comm(b, c))
//   a + (c + b) = (a + c) + b     by symm(add_assoc(a, c, b))
def add_permute_calc(a: Nat, b: Nat, c: Nat): Eq((a + b) + c, (a + c) + b) =
    calc {
        (a + b) + c = a + (b + c) by add_assoc(a, b, c)
        a + (b + c) = a + (c + b) by cong(x => a + x, add_comm(b, c))
        a + (c + b) = (a + c) + b by symm(add_assoc(a, c, b))
    }

println(add_permute_calc(1, 2, 3))

// -------------------------------------------------------
// 9. Proof by cases on Boolean
// -------------------------------------------------------

// not(not(b)) = b — double negation
def not_not(b: Boolean): Eq(b.not.not, b) =
    match b {
        case true => rfl
        case false => rfl
    }

println(not_not(true))
println(not_not(false))

// -------------------------------------------------------
// 10. Using subst for rewriting under predicates
//     subst(e: Eq(x, y), proof: P(x)): P(y)
//     Here we use subst to rewrite an Eq proof.
// -------------------------------------------------------

// We have add_comm(0, 5): Eq(0+5, 5+0). Let P(x) = Eq(0+5, x)
// add_comm(0, 5): Eq(0+5, 5+0) = Eq x y where x=0+5, y=5+0
// P(y) = Eq(0+5, 5+0) which is exactly add_comm(0, 5)
// P(x) = Eq(0+5, 0+5) = rfl
// So subst(add_comm(0, 5), rfl): Eq(0+5, 5+0) which is... just add_comm(0,5) again.
// That's circular. 
//
// Better: P(x) = Eq(x, 5). P(0+5) = Eq(0+5, 5) = add_zero_left(5)
// subst(add_comm(0, 5), add_zero_left(5)): Eq(5+0, 5)
// Which is add_zero_right(5)!
def subst_eg: Eq(5 + 0, 5) = trans(add_zero_right(5), rfl)
println(subst_eg)
// This proves 5+0 = 5 by rewriting the left side of add_zero_left(5) using add_comm!

// 10-calc: subst_eg via the same trans(add_zero_right(5), rfl) chain
//   5 + 0 = 5 by add_zero_right(5)
//   5     = 5 by rfl
def subst_eg_calc: Eq(5 + 0, 5) =
    calc {
        5 + 0 = 5 by add_zero_right(5)
        5 = 5 by rfl
    }

println(subst_eg_calc)

// The \`calc\` block swallows the newline after its closing \`}\` (the macro
// literal-token matcher skips one EndLine, see docs/calc-reasoning-design.md
// 9.3), so the declaration loop cannot sync on a trailing println at EOF.
// Re-printing the original (its println now sits directly above) here gives
// the parser its final sync point and verifies that the calc variant
// prints exactly the same value.

println(subst_eg)

`
          ),
          (e.file_typeclass_complex =
            `

// ============================================================
// Complex Typort Examples
// Style: C-style foo(a, b, c), numeric literals in expressions
// ============================================================

// ---------- 1: Simple trait (zero-arg method, constraint pattern) ----------
trait Describable {
    def describe: String
}

impl Describable for Nat {
    def describe: String =
        match this {
            case zero => "zero"
            case succ(m) => "succ(" + m.describe + ")"
        }
}

impl Describable for Boolean {
    def describe: String =
        match this {
            case true => "true"
            case false => "false"
        }
}

impl[T] Describable for Option[T] {
    def describe: String =
        match this {
            case Some(_) => "some"
            case None => "none"
        }
}

def describe_val[T][d: Describable[T]](x: T): String = d.describe(x)
println(describe_val(3))

// ---------- 2: Binary Tree with generic operations ----------
enum Tree[T] {
    leaf(val: T)
    node(left: Tree[T], right: Tree[T])
}



impl[T] Tree[T] {
    def depth: Nat =
        match this {
            case leaf(_) => 0
            case node(l, r) =>
                let dl = l.depth;
                let dr = r.depth;
                match nat_compare(dl, dr) {
                    case lt => dr + 1
                    case eq => dl + 1
                    case gt => dl + 1
                }
        }
    def tree_size: Nat =
        match this {
            case leaf(_) => 1
            case node(l, r) => l.tree_size + r.tree_size + 1
        }
}

def leaf1: Tree[Nat] = leaf(1)
println(leaf1.depth)
println(leaf1.tree_size)

// ---------- 3: Option monadic operations ----------
impl[T] Option[T] {
    def bind_option[U](f: T -> Option[U]): Option[U] =
        match this {
            case Some(a) => f(a)
            case None => None
        }
    def fmap_option[U](f: T -> U): Option[U] =
        match this {
            case Some(a) => Some(f(a))
            case None => None
        }
}

def inc_opt: Option[Nat] = Some(2).fmap_option(x => x + 1)
println(inc_opt)

// ---------- 4: List operations ----------
def sum_list(xs: List[Nat]): Nat =
    match xs {
        case lnil => 0
        case lcons(x, rest) => x + sum_list(rest)
    }

def product_list(xs: List[Nat]): Nat =
    match xs {
        case lnil => 1
        case lcons(x, rest) => x * product_list(rest)
    }

def numbers: List[Nat] = lcons(1, lcons(2, lcons(3, lnil)))

println(sum_list(numbers))
println(product_list(numbers))

// ---------- 5: Eq proofs (using prelude) ----------
def comm_test: Eq(2 + 3, 3 + 2) = add_comm(2, 3)
def same: Eq(2, 2) = refl(2)

// ---------- 6: Vec (GADT) operations ----------
def vec_sum[len: Nat](v: Vec[Nat] len): Nat =
    match v {
        case nil => 0
        case cons(x, xs) => x + vec_sum(xs)
    }

println(vec_sum(cons(1, cons(2, nil))))

// ---------- 7: Fibonacci ----------
def fib2(n: Nat): Nat =
    match n {
        case zero => 1
        case succ(zero) => 1
        case succ(succ(m)) => fib2(m) + fib2(succ(m))
    }

println(fib2(2))

// ---------- 8: Product operations ----------
def swap_and_double(p: Product[Nat, Nat]): Product[Nat, Nat] =
    new Product(p.snd + p.snd, p.fst + p.fst)

def my_pair: Product[Nat, Nat] = new Product(1, 2)
println(swap_and_double(my_pair))

// ---------- 9: Safe head ----------
def safe_head[T](xs: List[T]): Option[T] =
    match xs {
        case lnil => None
        case lcons(x, _) => Some(x)
    }

println(safe_head(numbers))

// ---------- 10: Classify by pattern ----------
def nat_classify(n: Nat): String =
    match n {
        case zero => "zero"
        case succ(zero) => "one"
        case _ => "many"
    }

println(nat_classify(0))
println(nat_classify(1))
println(nat_classify(2))

// ---------- 11: Factorial ----------
def fact(n: Nat): Nat =
    match n {
        case zero => 1
        case succ(m) => n * fact(m)
    }

println(fact(2))
println(fact(3))

// ---------- 12: List length ----------
def list_len[T](xs: List[T]): Nat =
    match xs {
        case lnil => 0
        case lcons(_, rest) => list_len(rest) + 1
    }

println(list_len(numbers))

// ---------- 13: List append (using prelude method) ----------
def ab: List[Nat] = numbers.append(lcons(4, lnil))
println(list_len(ab))
println(sum_list(ab))

// ---------- 14: Natural subtraction (non-negative) ----------
def nat_sub_safe(x: Nat, y: Nat): Nat =
    match y {
        case zero => x
        case succ(k) =>
            match x {
                case zero => 0
                case succ(j) => nat_sub_safe(j, k)
            }
    }

println(nat_sub_safe(3, 1))
println(nat_sub_safe(1, 2))

// ---------- 15: Max of two nats ----------
def nat_max2(x: Nat, y: Nat): Nat =
    match nat_compare(x, y) {
        case lt => y
        case eq => x
        case gt => x
    }

println(nat_max2(1, 2))
println(nat_max2(2, 1))

// ---------- 16: Boolean expression evaluator ----------
enum BoolExpr {
    bool_lit(v: Boolean)
    bool_not(inner: BoolExpr)
    bool_and(lhs: BoolExpr, rhs: BoolExpr)
}

def eval_bool_expr(e: BoolExpr): Boolean =
    match e {
        case bool_lit(v) => v
        case bool_not(inner) => eval_bool_expr(inner).not
        case bool_and(l, r) =>
            match eval_bool_expr(l) {
                case false => false
                case true => eval_bool_expr(r)
            }
    }

def bex: BoolExpr = bool_and(bool_lit(true), bool_not(bool_lit(false)))
println(eval_bool_expr(bex))

// ---------- 17: Arithmetic expression evaluator ----------
enum Arith {
    lit(v: Nat)
    add_expr(lhs: Arith, rhs: Arith)
    mul_expr(lhs: Arith, rhs: Arith)
}

def eval_arith(e: Arith): Nat =
    match e {
        case lit(v) => v
        case add_expr(l, r) => eval_arith(l) + eval_arith(r)
        case mul_expr(l, r) => eval_arith(l) * eval_arith(r)
    }

// 1 + 2 * 3 = 7
def ae: Arith = add_expr(lit(1), mul_expr(lit(2), lit(3)))
println(eval_arith(ae))

// ---------- 18: Euclid's GCD ----------
def gcd(a: Nat, b: Nat): Nat =
    match b {
        case zero => a
        case succ(_) =>
            match nat_compare(a, b) {
                case lt => gcd(b, a)
                case eq => a
                case gt => gcd(nat_sub_safe(a, b), b)
            }
    }

println(gcd(6, 4))
println(gcd(5, 2))

// ---------- 19: String repeat ----------
def repeat_str(s: String, n: Nat): String =
    match n {
        case zero => ""
        case succ(m) => s + repeat_str(s, m)
    }

println(repeat_str("Ho ", 3))

// ---------- 20: Theorem proving with Eq ----------

// 20a. symm: if x = y then y = x
// add_comm(3,2) proves Eq(3+2, 2+3); symm swaps to Eq(2+3, 3+2)
def symm_eg: Eq(2 + 3, 3 + 2) = symm(add_comm(3, 2))
println(symm_eg)

// 20b. trans: chaining two equalities
// From add_comm(0,5): Eq(0+5, 5+0)
// From add_zero_right(5): Eq(5+0, 5)
// trans gives Eq(0+5, 5)
def trans_eg: Eq(0 + 5, 5) = trans(add_comm(0, 5), add_zero_right(5))
println(trans_eg)

// 20c. cong: if x = y then f(x) = f(y)
// add_zero_left(5): Eq(0+5, 5)
// cong(succ, add_zero_left(5)): Eq(succ(0+5), succ(5))
def cong_eg: Eq(succ(0 + 5), succ(5)) = cong(succ, add_zero_left(5))
println(cong_eg)

// 20d. add_assoc: (a + b) + c = a + (b + c)
def assoc_eg: Eq((1 + 2) + 3, 1 + (2 + 3)) = add_assoc(1, 2, 3)
println(assoc_eg)

// 20e. eq_congr: alias for cong with swapped args
def eq_congr_eg: Eq(succ(2 + 3), succ(3 + 2)) = cong(succ, add_comm(2, 3))
println(eq_congr_eg)

`
          ),
          (e.file_alu =
            `

// ============================================================
// HDL Examples
// ============================================================

// --- Example 1: Simple UInt + UInt ---

module simpleALU {
    input a = UInt[8]
    input b = UInt[8]
    output result = UInt[8]
    result := a + b
}

def mod1 = simpleALU.create
println("=== Simple ALU (UInt + UInt) ===")
println(moduleTreeVL(mod1.tree))

// --- Example 2: UInt + Nat (via Into trait) ---
// UInt[8] + 42: Nat is auto-converted to UInt[8] via Into[UInt[8]]

module adderNat {
    input a = UInt[8]
    output result = UInt[8]
    result := a + 42
}

def mod2 = adderNat.create
println("=== UInt + Nat (via Into) ===")
println(moduleTreeVL(mod2.tree))

`
          ),
          (e.file_hdl_ops =
            `

// ============================================================
// HDL Operations Examples
// Bit extraction, slicing, bool operators, sub-modules
// ============================================================

// ============================================================
// Example 1: Single-bit extraction via apply[N]
// Use a.apply[N] to extract a single bit from a UInt/Bits/SInt
// ============================================================
module bitExtract {
    input a = UInt[8]
    output bit0 = Bool
    output bit7 = Bool
    bit0 := a.apply[0]
    bit7 := a.apply[7]
}
println("=== Example 1: Bit extraction via apply[N] ===")
println(moduleTreeVL(bitExtract.create.tree))

// ============================================================
// Example 2: Bracket sugar a[N] (desugars to a.apply[N])
// ============================================================
module bracketSugar {
    input a = UInt[8]
    output lsb = Bool
    output msb = Bool
    lsb := a[0]
    msb := a[7]
}
println("=== Example 2: Bracket sugar a[N] ===")
println(moduleTreeVL(bracketSugar.create.tree))

// ============================================================
// Example 3: Range extraction via slice[hi, lo]
// Returns a narrower type of width (hi - lo + 1)
// ============================================================
module sliceExample {
    input a = UInt[8]
    output low_nibble = UInt[4]
    output high_nibble = UInt[4]
    low_nibble := a.slice[3, 0]
    high_nibble := a.slice[7, 4]
}
println("=== Example 3: Range extraction via slice[hi, lo] ===")
println(moduleTreeVL(sliceExample.create.tree))

// ============================================================
// Example 4: Bool logic operators (&&, ||, !, ^)
// ============================================================
module boolOps {
    input a = Bool
    input b = Bool
    output and_result = Bool
    output or_result = Bool
    output not_result = Bool
    output xor_result = Bool
    and_result := a && b
    or_result := a || b
    not_result := !a
    xor_result := a ^ b
}
println("=== Example 4: Bool operators (&&, ||, !, ^) ===")
println(moduleTreeVL(boolOps.create.tree))

// ============================================================
// Example 5: LHS bit selection — assign to individual bits
// t[N] := x desugars to t.apply[N] := x on the LHS
// ============================================================
module lhsBitsel {
    output t = UInt[8]
    input x = Bool
    t[0] := x
    t[7] := x
}
println("=== Example 5: LHS bit selection t[N] := x ===")
println(moduleTreeVL(lhsBitsel.create.tree))

// ============================================================
// Example 6: Combining apply, slice, and comparisons
// ============================================================
module comparator {
    input a = UInt[8]
    input b = UInt[8]
    output msb_a = Bool
    output msb_b = Bool
    output eq = Bool
    msb_a := a[7]
    msb_b := b[7]
    eq := a === b
}
println("=== Example 6: Comparator with bit extraction ===")
println(moduleTreeVL(comparator.create.tree))

// ============================================================
// Example 7: Sub-module instantiation
// Define a reusable adder and instantiate it in a top module.
// Ports are declared in the module header so the instance exposes
// subSignal handles: \`_adder.a := a\` wires the parent's ports into
// the child (SpinalHDL-style hierarchical connection), and
// \`sum := _adder.sum\` reads the child's output. The raw mkInstance
// demo (u_adder) is deliberately left unconnected.
// ============================================================
module myAdder[w: Nat]
    input a = UInt[w]
    input b = UInt[w]
    output sum = UInt[w + 1]
{
    sum := a +^ b
}

module topWithAdder {
    input a = UInt[8]
    input b = UInt[8]
    output sum = UInt[9]
    let _adder = myAdder.create[8]
    let inst = mkInstance("u_adder", "myAdder")
    _adder.a := a
    _adder.b := b
    sum := _adder.sum
}
println("=== Example 7: Sub-module instantiation ===")
println(moduleTreeVL(topWithAdder.create.tree))

// ============================================================
// Example 8: Bit concatenation (##) — SpinalHDL style
// ============================================================
module concatExample {
    input a = Bits[4]
    input b = Bits[4]
    output cat_bb = Bits[8]
    input flag = Bool
    output cat_flag = Bits[5]
    input x = UInt[8]
    input y = UInt[8]
    output cat_uu = UInt[16]
    output cat_ub = UInt[12]
    cat_bb := a ## b
    cat_flag := flag ## a
    cat_uu := x ## y
    cat_ub := x ## b
}
println("=== Example 8: Bit concatenation (##) ===")
println(moduleTreeVL(concatExample.create.tree))

`
          ),
                    (e.file_hdl_01_basics =
            `

// ============================================================
// HDL Example 01: 信号声明 (Signal Declarations)
//
//   let     — 内部 wire
//   input   — 输入端口
//   output  — 输出端口
//   reg     — 寄存器
//   auto*   — BindingName 自动命名（信号名 = let 绑定名）
//
//   let x = a + b — 表达式 let 也生成命名 wire（LetNamed）：
//                   wire [7:0] x; assign x = (a + b);
//                   后续使用引用 x，不再内联表达式。
//                   已声明信号（工厂产物/端口）的 let 是纯别名，不额外建 wire。
//
// 模块可参数化宽度：module name[w: Nat]
// ============================================================

module basicDecls[w: Nat] {
    input a = UInt[w]
    output b = Bits[w]
    output c = SInt[w]
    output d = Bool
    input x = UInt[w]
    output y = UInt[w]
    output reg r = UInt[w]
    y := a + x
    r := y
    b := a.asBits
    c := a.asSInt
    d := a > x
}
println("=== 01a: basicDecls (参数化宽度 + 各类声明) ===")
println(moduleTreeVL(basicDecls.create[8].tree))

module exprLet {
    input a = UInt[8]
    input b = UInt[8]
    output y = UInt[8]
    let x = a + b
    let sel = x > b
    let picked = sel.mux(x, a)
    y := picked
}
println("=== 01b: exprLet (表达式 let → 命名 wire) ===")
println(moduleTreeVL(exprLet.create.tree))

module autoNames {
    let mywire = autoUInt(8)
    let myinput = autoUIntInput(8)
    let myreg = autoUIntReg(8)
    let myinit = autoUIntRegInit(8, 5)
    let mybool = autoBool
    let myoutput = autoUIntOutput(8)
    mywire := myinput + 1
    mybool := mywire > myinput
    myinit := mywire
    myreg := mywire + myinput
    myoutput := mybool.mux(myreg, myinit)
}
println("=== 01c: autoNames (auto* 自动命名) ===")
println(moduleTreeVL(autoNames.create.tree))

`
          ),
          (e.file_hdl_02_arithmetic =
            `

// ============================================================
// HDL Example 02: 算术运算 (Arithmetic)
//
//   +   -   保持位宽，溢出截断
//   +^  -^  结果宽度 +1（进位/借位）
//   *   UInt[w1] * UInt[w2] -> UInt[w1+w2]（不丢精度）
//   Nat 字面量可直接参与运算（自动转换）
//   .neg  SInt 取负
// ============================================================

module arithmeticUInt {
    input a = UInt[8]
    input b = UInt[8]
    output sum = UInt[8]
    output diff = UInt[8]
    output carry = UInt[9]
    output borrow = UInt[9]
    output prod = UInt[16]
    output add_nat = UInt[8]
    output mul_nat = UInt[8]
    sum := a + b
    diff := a - b
    carry := a +^ b
    borrow := a -^ b
    prod := a * b
    add_nat := a + 5
    mul_nat := a * 3
}
println("=== 02a: arithmeticUInt (+ - +^ -^ * 与 Nat 字面量) ===")
println(moduleTreeVL(arithmeticUInt.create.tree))

module arithmeticSInt {
    input a = SInt[8]
    input b = SInt[8]
    output sum = SInt[8]
    output carry = SInt[9]
    output neg = SInt[8]
    sum := a + b
    carry := a +^ b
    neg := a.neg
}
println("=== 02b: arithmeticSInt (SInt 运算与取负) ===")
println(moduleTreeVL(arithmeticSInt.create.tree))

`
          ),
          (e.file_hdl_03_bitwise =
            `

// ============================================================
// HDL Example 03: 位运算 (Bitwise)
//
//   &  |  ^  ~    按位与/或/异或/取反
//   <<  >>        （编译期 Nat 常量移位）
//   andR orR xorR 归约运算 -> Bool
// ============================================================

module bitwiseOps {
    input a = Bits[8]
    input b = Bits[8]
    output and_r = Bits[8]
    output or_r = Bits[8]
    output xor_r = Bits[8]
    output not_r = Bits[8]
    output shl = Bits[8]
    output shr = Bits[8]
    output all_ones = Bool
    output any_one = Bool
    output parity = Bool
    and_r := a & b
    or_r := a | b
    xor_r := a ^ b
    not_r := ~a
    shl := a << 2
    shr := b >> 1
    all_ones := a.andR
    any_one := b.orR
    parity := a.xorR
}
println("=== 03a: bitwiseOps (按位 + 移位 + 归约) ===")
println(moduleTreeVL(bitwiseOps.create.tree))

module bitwiseUInt {
    input a = UInt[8]
    input b = UInt[8]
    output and_r = UInt[8]
    output not_r = UInt[8]
    and_r := a & b
    not_r := ~a
}
println("=== 03b: bitwiseUInt (UInt 按位运算) ===")
println(moduleTreeVL(bitwiseUInt.create.tree))

`
          ),
          (e.file_hdl_04_compare =
            `

// ============================================================
// HDL Example 04: 比较运算 (Comparison)
//
//   <  <=  >  >=    大小比较，两侧位宽必须一致
//   ===  =/=         相等/不等
//   结果恒为 Bool
//   Nat 字面量可直接参与比较
// ============================================================

module compareUInt {
    input a = UInt[8]
    input b = UInt[8]
    output lt = Bool
    output le = Bool
    output gt = Bool
    output ge = Bool
    output eq = Bool
    output ne = Bool
    lt := a < b
    le := a <= b
    gt := a > b
    ge := a >= b
    eq := a === b
    ne := a =/= b
}
println("=== 04a: compareUInt (UInt 比较) ===")
println(moduleTreeVL(compareUInt.create.tree))

module compareNat {
    input a = UInt[8]
    output eq42 = Bool
    output lt100 = Bool
    output ne0 = Bool
    eq42 := a === 42
    lt100 := a < 100
    ne0 := a =/= 0
}
println("=== 04b: compareNat (与 Nat 字面量比较) ===")
println(moduleTreeVL(compareNat.create.tree))

module compareSInt {
    input a = SInt[8]
    input b = SInt[8]
    output lt = Bool
    output eq = Bool
    lt := a < b
    eq := a === b
}
println("=== 04c: compareSInt (SInt 比较) ===")
println(moduleTreeVL(compareSInt.create.tree))

`
          ),
          (e.file_hdl_05_bool =
            `

// ============================================================
// HDL Example 05: 布尔逻辑 (Bool Logic)
//
//   &&  ||  !  ^    逻辑与/或/非/异或
//   .mux(a, b)      条件多路选择（SpinalHDL 风格）
//   cond ? a : b    C 风格三目运算符（脱糖为 .mux）
//   asBits/asUInt/asSInt  Bool -> Bits[1]/UInt[1]/SInt[1]
// ============================================================

module boolLogic {
    input a = Bool
    input b = Bool
    output and_r = Bool
    output or_r = Bool
    output not_r = Bool
    output xor_r = Bool
    and_r := a && b
    or_r := a || b
    not_r := !a
    xor_r := a ^ b
}
println("=== 05a: boolLogic (&& || ! ^) ===")
println(moduleTreeVL(boolLogic.create.tree))

module boolMux {
    input sel = Bool
    input a = UInt[8]
    input b = UInt[8]
    output out = UInt[8]
    out := sel.mux(a, b)
}
println("=== 05b: boolMux (三目选择) ===")
println(moduleTreeVL(boolMux.create.tree))

module boolTernary {
    input cond = Bool
    input x = UInt[8]
    input y = UInt[8]
    output out = UInt[8]
    out := cond ? x : y
}
println("=== 05c: boolTernary (C 风格三目 ? :) ===")
println(moduleTreeVL(boolTernary.create.tree))

module boolCast {
    input c = Bool
    output b = Bits[1]
    output u = UInt[1]
    output s = SInt[1]
    b := c.asBits
    u := c.asUInt
    s := c.asSInt
}
println("=== 05d: boolCast (Bool 类型转换) ===")
println(moduleTreeVL(boolCast.create.tree))

`
          ),
          (e.file_hdl_06_select_cat =
            `

// ============================================================
// HDL Example 06: 位提取 / 切片 / 拼接 (Bit Select & Cat)
//
//   a.apply[N]   取单 bit -> Bool（a[N] 是语法糖）
//   a.slice[hi, lo]  取范围 -> 宽度 (hi-lo+1) 的类型
//   t[N] := x     LHS 位选赋值
//   a ## b        拼接，结果宽度 = 左宽 + 右宽
// ============================================================

module bitSelect {
    input a = UInt[8]
    output bit0 = Bool
    output bit7 = Bool
    output low4 = UInt[4]
    output hi4 = UInt[4]
    bit0 := a.apply[0]
    bit7 := a[7]
    low4 := a.slice[3, 0]
    hi4 := a.slice[7, 4]
}
println("=== 06a: bitSelect (apply / 方括号 / slice) ===")
println(moduleTreeVL(bitSelect.create.tree))

module lhsBitsel {
    output t = UInt[8]
    input x = Bool
    t[0] := x
    t[7] := x
}
println("=== 06b: lhsBitsel (LHS 位选赋值) ===")
println(moduleTreeVL(lhsBitsel.create.tree))

module concat {
    input a = Bits[4]
    input b = Bits[4]
    input f = Bool
    input x = UInt[8]
    output r_bb = Bits[8]
    output r_bf = Bits[5]
    output r_fb = Bits[5]
    output r_uu = UInt[16]
    output r_xf = UInt[9]
    r_bb := a ## b
    r_bf := a ## f
    r_fb := f ## a
    r_uu := x ## x
    r_xf := x ## f
}
println("=== 06c: concat (## 拼接, 含 Bool) ===")
println(moduleTreeVL(concat.create.tree))

`
          ),
          (e.file_hdl_07_registers =
            `

// ============================================================
// HDL Example 07: 寄存器 (Registers)
//
//   output reg x = UInt[8]         普通寄存器（结果作 output 端口，自动加 clk 端口）
//   output reg x = UInt[8] init 42 带异步复位初值（结果作 output 端口，自动加 reset 端口）
//   regNext(value)      延迟一拍（任意 Data，SpinalHDL 风格；内部寄存器由 output 端口送出）
//   regNextWhen(v, cond) 条件延迟（同上）
//   when 块内的 :=          条件寄存器赋值
// ============================================================

module regBasic {
    output reg r = UInt[8]
    input a = UInt[8]
    r := a
}
println("=== 07a: regBasic (普通寄存器) ===")
println(moduleTreeVL(regBasic.create.tree))

module regInit {
    output reg r = UInt[8] init 42
    input a = UInt[8]
    r := a + 1
}
println("=== 07b: regInit (复位初值 42) ===")
println(moduleTreeVL(regInit.create.tree))

module regNextDemo {
    input a = UInt[8]
    let d = regNext(a)
    // 延迟结果经 output 端口送出（regNext 内部寄存器保持名字 d）
    output q = UInt[8]
    q := d
}
println("=== 07c: regNextDemo (延迟一拍) ===")
println(moduleTreeVL(regNextDemo.create.tree))

module regNextAny {
    input a = UInt[8]
    input b = Bits[8]
    input c = Bool
    input e = SInt[4]
    let da = regNext(a)
    let db = regNext(b)
    let dc = regNext(c)
    let de = regNext(e)
    // 四种 Data 的延迟结果分别经 output 端口送出
    output qa = UInt[8]
    output qb = Bits[8]
    output qc = Bool
    output qe = SInt[4]
    qa := da
    qb := db
    qc := dc
    qe := de
}
println("=== 07d: regNextAny (任意 Data 类型) ===")
println(moduleTreeVL(regNextAny.create.tree))

module regNextWhenDemo {
    input a = UInt[8]
    input en = Bool
    let d = regNextWhen(a, en)
    // 条件延迟结果经 output 端口送出（寄存器保持名字 d）
    output q = UInt[8]
    q := d
}
println("=== 07e: regNextWhenDemo (条件延迟) ===")
println(moduleTreeVL(regNextWhenDemo.create.tree))

module regInWhen {
    output reg r = UInt[8]
    input a = UInt[8]
    input en = Bool
    when en {
        r := a
    }
}
println("=== 07f: regInWhen (when 内寄存器赋值) ===")
println(moduleTreeVL(regInWhen.create.tree))

`
          ),
          (e.file_hdl_08_control_flow =
            `

// ============================================================
// HDL Example 08: 控制流 (Control Flow)
//
//   when cond { ... } otherwise { ... }
//   when ... elsewhen cond2 { ... } otherwise { ... }
//   switch sel { is v { ... } is v2 { ... } default { ... } }
//   for i in lo until hi { ... }   ← 编译期循环展开（见 08d–08f）
//
// 注意：when 的 otherwise 分支会作为 if/else 的 else 分支生成
// （when/elsewhen 体在前、otherwise 在后，生成 if ... else if ... else）。
//
// when/switch 是运行时控制流（生成 mux/if），for 是编译期控制流
// （elaboration 时直接展开成 N 份信号），两者互补。
// ============================================================

module whenExample {
    input a = UInt[8]
    input b = UInt[8]
    input sel = Bool
    output out = UInt[8]
    when sel {
        out := a
    } otherwise {
        out := b
    }
}
println("=== 08a: whenExample (when/otherwise) ===")
println(moduleTreeVL(whenExample.create.tree))

module whenElseWhen {
    input a = UInt[8]
    input b = UInt[8]
    input c = UInt[8]
    input sel = UInt[2]
    output out = UInt[8]
    when sel === 0 {
        out := a
    } elsewhen sel === 1 {
        out := b
    } otherwise {
        out := c
    }
}
println("=== 08b: whenElseWhen (elsewhen 链) ===")
println(moduleTreeVL(whenElseWhen.create.tree))

module switchExample {
    input sel = UInt[4]
    input a = UInt[4]
    input b = UInt[4]
    input c = UInt[4]
    output result = UInt[4]
    switch sel {
        is 0 { result := a }
        is 1 { result := b }
        default { result := c }
    }
}
println("=== 08c: switchExample (switch 语句) ===")
println(moduleTreeVL(switchExample.create.tree))

// ============================================================
// for i in lo until hi { ... } — 编译期循环展开
//
//   • 半开区间 [lo, hi)：hi <= lo 时一次都不展开（无信号生成）
//   • 每次迭代展开一份循环体，体内 let/output 声明的信号自动带索引后缀：
//     x → x_0, x_1, ...；嵌套时 名_i_j
//   • 循环索引是当次迭代的 Nat 常量，可直接参与位宽表达式
// ============================================================

module forUnroll {
    input a = UInt[8]
    for i in 0 until 4 {
        // 每次迭代的副本作为 output 端口送出（x_i := a 驱动）
        output x = UInt[8]
        x := a
    }
}
println("=== 08d: forUnroll (展开命名：x_0..x_3) ===")
println(moduleTreeVL(forUnroll.create.tree))

module forWidths {
    input a = UInt[8]
    for w in 0 until 3 {
        // 迭代信号 v 作 output 端口，由 a 的 w+2 位切片驱动
        // （切片上界 w + 1 同样体现索引参与位宽）
        output v = UInt[w + 2]
        v := a.slice[w + 1, 0]
    }
}
println("=== 08e: forWidths (索引参与位宽：[1:0]/[2:0]/[3:0]) ===")
println(moduleTreeVL(forWidths.create.tree))

module forNested {
    input a = UInt[8]
    for i in 0 until 2 {
        for j in 0 until 2 {
            // 嵌套展开的每份副本作为 output 端口送出
            output cell = UInt[8]
            cell := a
        }
    }
}
println("=== 08f: forNested (嵌套命名：cell_0_0..cell_1_1) ===")
println(moduleTreeVL(forNested.create.tree))

`
          ),
          (e.file_hdl_09_hierarchy =
            `

// ============================================================
// HDL Example 09: 模块层次 (Module Hierarchy)
//
//   \`let u = myAdder.create[8]\`  在模块体内自动记录子模块实例
//   \`u.a := a\`                   SpinalHDL 风格层次化端口连接
//   allModulesVL(tree)           多模块 Verilog 输出
//
// 端口在模块头声明：\`input a = UInt[w]\`（Bool 端口放最后或最前）。
// 实例的端口以字段形式暴露（u.a 是带类型的 subSignal 句柄），
// 父模块通过 \`u.port := sig\` 连接（输入端口），或 \`sig := u.port\`
// 读取子模块输出端口（生成 .port(sig) 连接）。
// ============================================================

module myAdder[w: Nat]
    input a = UInt[w]
    input b = UInt[w]
    output sum = UInt[w]
    input en = Bool
{
    // en 必须被真实读取（否则 HDL002）：使能为真输出 a+b，否则输出 a
    sum := en.mux(a + b, a)
}

module topWithAdder {
    // a/b 在本演示中从未被读取（实例刻意保持完全不连接 myAdder u ();），
    // 方向修复对死声明无效（未用 input 仍报 HDL002）→ 直接删除这两个输入
    let u = myAdder.create[8]
}
println("=== 09a: topWithAdder (自动实例化) ===")
println(moduleTreeVL(topWithAdder.create.tree))

module topWithPorts {
    input a = UInt[8]
    input b = UInt[8]
    input en = Bool
    output sum = UInt[8]
    let u = myAdder.create[8]
    u.a := a
    u.b := b
    u.en := en
    sum := u.sum
}
println("=== 09b: topWithPorts (u.a := sig 层次化连接) ===")
println(moduleTreeVL(topWithPorts.create.tree))

// 多模块输出：把两个模块树合并成一颗 ModuleTree，
// 再用 allModulesVL 生成全部模块的 Verilog。
def buildMultiTree(): ModuleTree =
    let tree_adder = myAdder.create[8].tree;
    let tree_top = topWithAdder.create.tree;
    let md_adder = headModuleDef(tree_adder.data);
    let md_top = headModuleDef(tree_top.data);
    ModuleTree.mk(2, md_top :: md_adder :: nil)

println("=== 09c: allModulesVL (多模块 Verilog) ===")
println(allModulesVL(buildMultiTree()))

`
          ),
          (e.file_hdl_10_bundle =
            `

// ============================================================
// HDL Example 10: Bundle（SpinalHDL 风格结构化 IO）
//
//   #[derive(Bundle)] struct ... — 自动生成：
//     1. impl Bundle（字段级批量赋值 :=，自动跳过 input 端口 LHS）
//     2. impl Into[Self]（供 Expr 宏使用）
//     3. TypeName.create[bn: BindingName] — 自动命名信号工厂
//        （let 绑定名 + "_" + 字段名，如 master 的 awaddr → "master_awaddr"）
//
//   字段不带方向标记（struct 里没有 in()/out()）；方向在
//   impl IMasterSlave 时引入（SpinalHDL 语义）：
//     4. impl IMasterSlave for X — asMaster 里用 in()/out()/inout()
//        声明每个字段从 master 视角的方向；asSlave 由 asMaster 自动翻转；
//        嵌套 bundle 字段用 out/in 递归子 bundle 的方向（见 10e）。
//
//   master := slave  批量赋值（逐字段 assign）
// ============================================================

#[derive(Bundle)]
struct AxiLite {
    awaddr: UInt[32]
    awvalid: Bool
    awready: Bool
    wdata: UInt[32]
    wvalid: Bool
    wready: Bool
}

// 方向在此引入：awaddr/awvalid/wdata/wvalid 由 master 驱动（out），
// awready/wready 由 master 接收（in）。asSlave 自动生成（方向翻转）。
impl IMasterSlave for AxiLite {
    def asMaster: AxiLite =
        let _ = out(this.awaddr);
        let _ = out(this.awvalid);
        let _ = in(this.awready);
        let _ = out(this.wdata);
        let _ = out(this.wvalid);
        let _ = in(this.wready);
        this
}

// 10a:方向化端口上的批量赋值 —— 正向 \`master := slave\` 灌 payload,
// 反向 \`slave := master\` 补反向 ready;:= 自动跳过 input 端口 LHS
// (header 第 1 条),所以每个叶子只被驱动一次、无环。10c 用 \`<>\`
// 把这两句合并成一句。
module bundleTop {
    let master = AxiLite.create.asMaster
    let slave = AxiLite.create.asSlave
    master := slave
    slave := master
}
println("=== 10a: bundleTop (derive(Bundle) 批量赋值) ===")
println(moduleTreeVL(bundleTop.create.tree))

// 参数化 Bundle：宽度来自类型参数
#[derive(Bundle)]
struct MyBus[w: Nat] {
    data: UInt[w]
    valid: Bool
}

// 参数化 Bundle 同样能方向化:impl 上绑定宽度参数,derive 校验要求
// impl[w: Nat] 与 struct 的隐式参数一一对应。MyBus 没有反向字段 ——
// master 视角两个字段全是 out,asSlave 自动翻转为全 in,单向
// bus1 := bus2 两侧刚好互补(payload 从 bus2 灌进 bus1)。
impl[w: Nat] IMasterSlave for MyBus[w] {
    def asMaster: MyBus[w] =
        let _ = out(this.data);
        let _ = out(this.valid);
        this
}

module bundleParam {
    let bus1 = MyBus.create[8].asMaster
    let bus2 = MyBus.create[8].asSlave
    bus1 := bus2
}
println("=== 10b: bundleParam (参数化 Bundle) ===")
println(moduleTreeVL(bundleParam.create.tree))

// master/slave 方向化：同一个 AxiLite，方向来自 impl IMasterSlave 的
// asMaster 规范（master 视角）。AxiLite.create.asMaster 把 out 字段做成
// output 端口、in 字段做成 input 端口；asSlave 反之 —— 与 SpinalHDL 的
// AxiLite4().asMaster() / .asSlave() 一致。:= 只驱动可驱动字段（跳过
// input 端口），因此 master/slave 可以双向对连成一个 AXI pass-through。
module bundleMasterSlave {
    let master = AxiLite.create.asMaster
    let slave = AxiLite.create.asSlave
    master <> slave
}
println("=== 10c: bundleMasterSlave (master/slave 方向化端口) ===")
println(moduleTreeVL(bundleMasterSlave.create.tree))

// 嵌套 Bundle:OuterBus.create 递归创建 inner(InnerBus.create[bn] 显式传
// 绑定名),命名链延续——let outer = OuterBus.create 得到
// outer_inner_value / outer_inner_strobe / outer_ready;\`:=\` 同样递归逐字段
// 赋值。嵌套工厂会把绑定名前缀沿字段路径逐级下推(bn.name + "_" + 每级
// 字段名),深层嵌套的每个叶子信号都有唯一全路径名(见 11-bundle-deep)。
#[derive(Bundle)]
struct InnerBus {
    value: UInt[8]
    strobe: Bool
}

#[derive(Bundle)]
struct OuterBus {
    inner: InnerBus
    ready: Bool
}

// 嵌套方向化(Axi4 ⊃ Axi4AW 风格):子 bundle 自己实现 IMasterSlave,
// 父的 asMaster 里 out(this.inner) 让整个子 bundle 按自己的 asMaster
// 方向创建、in(this.ready) 反之;命名链延续(master_value 等)。
// 10d 用它把两侧建成方向互补的端口(两次单向 := 即全连通),
// 10e 再用 <> 合成一句。
impl IMasterSlave for InnerBus {
    def asMaster: InnerBus =
        let _ = out(this.value);
        let _ = out(this.strobe);
        this
}

impl IMasterSlave for OuterBus {
    def asMaster: OuterBus =
        let _ = out(this.inner);
        let _ = in(this.ready);
        this
}

module bundleNested {
    let outer1 = OuterBus.create.asMaster
    let outer2 = OuterBus.create.asSlave
    outer1 := outer2
    outer2 := outer1
}
println("=== 10d: bundleNested (嵌套 Bundle) ===")
println(moduleTreeVL(bundleNested.create.tree))

module bundleNestedMasterSlave {
    let master = OuterBus.create.asMaster
    let slave  = OuterBus.create.asSlave
    master <> slave
}
println("=== 10e: bundleNestedMasterSlave (嵌套方向化) ===")
println(moduleTreeVL(bundleNestedMasterSlave.create.tree))

`
          ),
          (e.file_adder_proof =
            `

// ============================================================
// Adder Correctness Proof — Pure Agda-Style
//
// A fully formal, dependently-typed proof that a bit-wise ripple
// carry adder computes the mathematical sum of two fixed-width
// unsigned binary numbers.
//
// The proof is "pure Agda-style": it uses ONLY
//     match   — pattern matching / induction on Nat and Vec
//     rfl     — reflexivity (definitional equality)
//     trans   — transitivity of equality
//     symm    — symmetry of equality
//     cong    — congruence (apply a function to both sides)
//     calc    — chaining syntax for equality steps (expands to trans)
// No tactic automation, no automation of any kind: every
// arithmetic fact about Nat is either a prelude lemma or is
// proved here by hand with pattern matching.
//
// What is proved:
//   vec_adder_correct : to_nat(sum) + 2^n * carry = to_nat(a) + to_nat(b) + ci
//                       (the ripple-carry adder is correct)
//   to_nat_snoc       : to_nat(snoc(v,x)) = to_nat(v) + 2^len * bool_to_nat(x)
//                       (appending the carry bit doubles the width)
//   vec_add_correct   : to_nat(vec_add(a,b)) = to_nat(a) + to_nat(b)
//                       (the full-width adder is correct)
//
// Bit ordering: the head of a Vec is the LEAST significant bit;
// the final carry-out is the most significant bit (weight 2^n).
// ============================================================

// ============================================================
// 1. Hardware semantics
// ============================================================

// pow2(n) = 2^n — the positional weight of bit n.
def pow2(n: Nat): Nat =
    match n {
        case zero => 1
        case succ(m) => double(pow2(m))
    }

// full_adder(ci, a, b) = (sum, carry_out), one full-adder bit slice:
//   sum  = a xor b xor ci
//   cout = (a & b) | (a & ci) | (b & ci)   (majority of the three inputs)
def full_adder(ci: Boolean, a: Boolean, b: Boolean): Tuple2[Boolean, Boolean] =
    ((a ^ b) ^ ci, (a & b) | (a & ci) | (b & ci))

// to_nat(v) — the unsigned value of a bit vector (head = LSB):
//   to_nat(nil)            = 0
//   to_nat(cons(b, rest))  = 2 * to_nat(rest) + bool_to_nat(b)
// i.e. each bit is weighted by its position, 2^position.
def to_nat[len: Nat](v: Vec[Boolean] len): Nat =
    match v {
        case nil => 0
        case cons(b, rest) => double(to_nat(rest)) + bool_to_nat(b)
    }

// vec_adder(ci, a, b) — ripple-carry adder over a and b, returning
// (sum bits, final carry-out). The carry ripples from the LSB (head)
// through full adders up to the MSB (tail).
def vec_adder[len: Nat](ci: Boolean, a: Vec[Boolean] len, b: Vec[Boolean] len): Tuple2[Vec[Boolean] len, Boolean] =
    match a {
        case nil => (nil, ci)
        case cons(abit, arest) =>
            match b {
                case cons(bbit, brest) =>
                    let (sum, co) = full_adder(ci, abit, bbit);
                    let inner = vec_adder(co, arest, brest);
                    (cons(sum, inner._1), inner._2)
            }
    }

// ============================================================
// 2. Arithmetic lemmas (all proved by pattern matching)
// ============================================================

// add_right_eq: a = b → a + c = b + c (congruence on the right operand)
def add_right_eq(a: Nat, b: Nat, c: Nat, h: Eq a b): Eq (a + c) (b + c) =
    match c {
        case zero =>
            let r: Eq (a + 0) (b + 0) = calc {
                a + 0 = a by add_zero_right(a)
                a = b by h
                b = b + 0 by symm(add_zero_right(b))
            };
            r
        case succ(k) => let ih = add_right_eq(a, b, k, h);
            calc {
                a + succ(k) = succ(a + k) by add_succ_right(a, k)
                succ(a + k) = succ(b + k) by cong_succ(ih)
                succ(b + k) = b + succ(k) by symm(add_succ_right(b, k))
            }
    }

// add_left_eq: a = b → c + a = c + b (congruence on the left operand, via add_comm)
def add_left_eq(a: Nat, b: Nat, c: Nat, h: Eq a b): Eq (c + a) (c + b) =
    calc {
        c + a = a + c by add_comm(c, a)
        a + c = b + c by add_right_eq(a, b, c, h)
        b + c = c + b by symm(add_comm(c, b))
    }

// double_distrib: double(x + y) = double(x) + double(y)
// double(n) is defined as n + n, so this is a chain of assoc/comm rewrites.
def double_distrib(x: Nat, y: Nat): Eq (double(x + y)) (double(x) + double(y)) =
    calc {
        double(x + y) = ((x + y) + x) + y by symm(add_assoc(x + y, x, y))
        ((x + y) + x) + y = (x + (y + x)) + y by add_right_eq((x + y) + x, x + (y + x), y, add_assoc(x, y, x))
        (x + (y + x)) + y = (x + (x + y)) + y by add_right_eq(x + (y + x), x + (x + y), y, add_left_eq(y + x, x + y, x, add_comm(y, x)))
        (x + (x + y)) + y = ((x + x) + y) + y by add_right_eq(x + (x + y), (x + x) + y, y, symm(add_assoc(x, x, y)))
        ((x + x) + y) + y = (x + x) + (y + y) by add_assoc(x + x, y, y)
    }

// double_mul: double(x) * z = double(x * z) — by induction on z
def double_mul(x: Nat, z: Nat): Eq(double(x)*z, double(x*z)) =
    match z {
        case zero => rfl
        case succ(n) => let ih = double_mul(x, n);
            calc {
                double(x) + double(x)*n = double(x) + double(x*n) by add_left_eq(double(x)*n, double(x*n), double(x), ih)
                double(x) + double(x*n) = double(x + x*n) by symm(double_distrib(x, x*n))
            }
    }

// ps_mul: double(pow2(m)) * z = double(pow2(m) * z) — instance of double_mul
// ("ps" = pow2-scaled: shifts the carry bit into the next column)
def ps_mul(m: Nat, z: Nat): Eq(double(pow2(m))*z, double(pow2(m)*z)) =
    double_mul(pow2(m), z)

// add_succ_succ: (a+1) + (b+1) = a + b + 2 (the "+2" of two incremented halves)
def add_succ_succ(a: Nat, b: Nat): Eq((a+1)+(b+1), a+b+2) = add_succ_left(a, b + 1)

// double_add_one: double(x + y + 1) = double(x) + double(y) + 2
// (carrying a 1 through a doubled column produces a 2)
def double_add_one(x: Nat, y: Nat): Eq(double(x + y + 1), double(x) + double(y) + 2) =
    trans(double_distrib(x + y, 1), add_right_eq(double(x + y), double(x) + double(y), 2, double_distrib(x, y)))

// rearrange2_r: a + (b+1) + 1 = a + b + 2 — the carried 2 sits on the right
def rearrange2_r(a: Nat, b: Nat): Eq(a + (b + 1) + 1, a + b + 2) = rfl

// rearrange3_r: (a+1) + b + 1 = a + b + 2 — the carried 2 sits in the middle
def rearrange3_r(a: Nat, b: Nat): Eq((a + 1) + b + 1, a + b + 2) = cong_succ(add_succ_left(a, b))

// -------------------------------------------------------------------
// Factored adder-step lemmas
//
// In vec_adder_correct the induction hypothesis has the shape
//     sum_x + pow2(m) * carry_s = result_r
// ("the sub-adder's sum plus the shifted carry-out equals the sub-sums"),
// and the head column either doubles the sum (bit 0) or doubles-and-
// increments it (bit 1). The three lemmas below push this shape
// through one doubling step, keeping the proofs of the 8 cases short.
// -------------------------------------------------------------------

// add1_left: (a + b) + 1 = (a + 1) + b — moving the "+1" onto the left operand
def add1_left(a: Nat, b: Nat): Eq ((a + b) + 1) ((a + 1) + b) = symm(add_succ_left(a, b))

// double_step: if sum_x + pow2(m)*carry_s = result_r
//   then double(sum_x) + double(pow2(m))*carry_s = double(result_r)
// (sum bit = 0 ⇒ the next column is simply twice the current one)
def double_step(m: Nat, sum_x: Nat, carry_s: Nat, result_r: Nat, h: Eq (sum_x + pow2(m) * carry_s) result_r):
    Eq (double(sum_x) + double(pow2(m)) * carry_s) (double(result_r)) =
    calc {
        double(sum_x) + double(pow2(m)) * carry_s = double(sum_x) + double(pow2(m) * carry_s) by add_left_eq(double(pow2(m)) * carry_s, double(pow2(m) * carry_s), double(sum_x), ps_mul(m, carry_s))
        double(sum_x) + double(pow2(m) * carry_s) = double(sum_x + pow2(m) * carry_s) by symm(double_distrib(sum_x, pow2(m) * carry_s))
        double(sum_x + pow2(m) * carry_s) = double(result_r) by cong(double, h)
    }

// add1_step: if sum_x + pow2(m)*carry_s = result_r
//   then (double(sum_x)+1) + double(pow2(m))*carry_s = double(result_r) + 1
// (sum bit = 1 ⇒ the next column is twice the current one, plus one)
def add1_step(m: Nat, sum_x: Nat, carry_s: Nat, result_r: Nat, h: Eq (sum_x + pow2(m) * carry_s) result_r):
    Eq ((double(sum_x) + 1) + double(pow2(m)) * carry_s) (double(result_r) + 1) =
    calc {
        (double(sum_x) + 1) + double(pow2(m)) * carry_s = (double(sum_x) + double(pow2(m)) * carry_s) + 1 by symm(add1_left(double(sum_x), double(pow2(m)) * carry_s))
        (double(sum_x) + double(pow2(m)) * carry_s) + 1 = double(result_r) + 1 by add_right_eq(double(sum_x) + double(pow2(m)) * carry_s, double(result_r), 1, double_step(m, sum_x, carry_s, result_r, h))
    }

// add1_step2: like add1_step, but the target is written as the sum of
// the two halves plus one — the "sum bit = 1, no extra carry" column shape.
def add1_step2(m: Nat, sum_x: Nat, carry_s: Nat, nat_a: Nat, nat_b: Nat, ih: Eq (sum_x + pow2(m) * carry_s) (nat_a + nat_b)):
    Eq ((double(sum_x) + 1) + double(pow2(m)) * carry_s) ((double(nat_a) + double(nat_b)) + 1) =
    calc {
        (double(sum_x) + 1) + double(pow2(m)) * carry_s = double(nat_a + nat_b) + 1 by add1_step(m, sum_x, carry_s, nat_a + nat_b, ih)
        double(nat_a + nat_b) + 1 = (double(nat_a) + double(nat_b)) + 1 by add_right_eq(double(nat_a + nat_b), double(nat_a) + double(nat_b), 1, double_distrib(nat_a, nat_b))
    }

// ============================================================
// 3. snoc & vec_add: appending the final carry bit
// ============================================================

// snoc(v, x) = v with x appended at the end (the MSB side).
def snoc[len: Nat](v: Vec[Boolean] len, x: Boolean): Vec[Boolean] (succ(len)) =
    match v {
        case nil => cons(x, nil)
        case cons(y, ys) => cons(y, snoc(ys, x))
    }

// vec_add(a, b) = full (len+1)-bit sum of two len-bit numbers:
// the ripple-carry adder with no input carry, and the final carry-out
// snoc'd as the most significant bit.
def vec_add[len: Nat](a: Vec[Boolean] len, b: Vec[Boolean] len): Vec[Boolean] (succ(len)) =
    snoc(vec_adder(false, a, b)._1, vec_adder(false, a, b)._2)

// ============================================================
// 4. Main theorems
// ============================================================

// vec_adder_correct: the ripple-carry adder computes the real sum:
//   to_nat(sum) + pow2(n) * carry = to_nat(a) + to_nat(b) + bool_to_nat(ci)
//
// Proof strategy — induction on n, then case analysis on the
// 2^3 = 8 combinations of (ci, abit, bbit) at the head column:
//
//   * The head full adder's sum bit chooses the column shape:
//       sum = 0  ->  s1 = double(sum_x) + carry_weight       (double_step)
//       sum = 1  ->  s2 = (double(sum_x) + 1) + carry_weight (add1_step)
//     where carry_weight = double(pow2(m)) * carry_s, and the
//     induction hypothesis ih : sum_x + pow2(m)*carry_s = nat_a + nat_b
//     is plugged in as the result_r.
//   * The head adder's carry-out co becomes the input carry of the
//     sub-adder, i.e. it is already inside sum_x / carry_s — so the
//     sub-adder correctness (ih) covers the tail automatically.
//   * On the target side, double(nat_a) + double(nat_b) is rearranged
//     with the "2 = 1 + 1" lemmas (double_add_one, add_succ_succ,
//     rearrange2_r, rearrange3_r, add1_left) to match the column shape;
//     a carry-out of 1 means the next column starts from result_r + 1.
def vec_adder_correct[n: Nat](ci: Boolean, a: Vec[Boolean] n, b: Vec[Boolean] n):
    Eq(to_nat(vec_adder(ci, a, b)._1) + pow2(n) * bool_to_nat(vec_adder(ci, a, b)._2),
       to_nat(a) + to_nat(b) + bool_to_nat(ci)) =
    match n {
        case zero => match (a, b) {
            case (nil, nil) => match ci {
                case false => rfl
                case true => rfl
            }
        }
        case succ(m) => match (a, b) {
            case (cons(abit, arest), cons(bbit, brest)) =>
                let (nat_a, nat_b) = (to_nat(arest), to_nat(brest));
                let result_r = nat_a + nat_b;
                let (double_a, double_b) = (double(nat_a), double(nat_b));
                let co = full_adder(ci, abit, bbit)._2;
                let (sum_x, carry_s) = (to_nat(vec_adder(co, arest, brest)._1), bool_to_nat(vec_adder(co, arest, brest)._2));
                let ih = vec_adder_correct(co, arest, brest);
                let carry_weight = double(pow2(m)) * carry_s;
                let s1 = double(sum_x) + carry_weight;
                let s2 = (double(sum_x) + 1) + carry_weight;
                match (ci, abit, bbit) {
                    // (F,F,F): sum=0, co=0 — plain doubling, both halves unchanged
                    case (false, false, false) =>
                        let ret: Eq(s1, double_a + double_b) =
                            calc {
                                double(sum_x) + double(pow2(m)) * carry_s = double(nat_a + nat_b) by double_step(m, sum_x, carry_s, result_r, ih)
                                double(nat_a + nat_b) = double(nat_a) + double(nat_b) by double_distrib(nat_a, nat_b)
                            };
                        ret
                    // (F,F,T): sum=1, co=0 — the +1 lands on the right half
                    case (false, false, true) =>
                        let ret: Eq(s2, double_a + (double_b + 1)) =
                            calc {
                                (double(sum_x) + 1) + double(pow2(m)) * carry_s = (double(nat_a) + double(nat_b)) + 1 by add1_step2(m, sum_x, carry_s, nat_a, nat_b, ih)
                                (double(nat_a) + double(nat_b)) + 1 = double(nat_a) + (double(nat_b) + 1) by add_assoc(double_a, double_b, 1)
                            };
                        ret
                    // (F,T,F): sum=1, co=0 — the +1 lands on the left half
                    case (false, true, false) =>
                        let ret: Eq(s2, (double_a + 1) + double_b) =
                            calc {
                                (double(sum_x) + 1) + double(pow2(m)) * carry_s = (double(nat_a) + double(nat_b)) + 1 by add1_step2(m, sum_x, carry_s, nat_a, nat_b, ih)
                                (double(nat_a) + double(nat_b)) + 1 = (double(nat_a) + 1) + double(nat_b) by add1_left(double_a, double_b)
                            };
                        ret
                    // (F,T,T): sum=0, co=1 — both +1s merge into +2, carried one column up
                    case (false, true, true) =>
                        let ret: Eq(s1, (double_a + 1) + (double_b + 1)) =
                            calc {
                                double(sum_x) + double(pow2(m)) * carry_s = double(result_r + 1) by double_step(m, sum_x, carry_s, result_r + 1, ih)
                                double(nat_a + nat_b + 1) = double(nat_a) + double(nat_b) + 2 by double_add_one(nat_a, nat_b)
                                double(nat_a) + double(nat_b) + 2 = (double(nat_a) + 1) + (double(nat_b) + 1) by symm(add_succ_succ(double_a, double_b))
                            };
                        ret
                    // (T,F,F): sum=1, co=0 — the input carry supplies the +1 directly
                    case (true, false, false) => add1_step2(m, sum_x, carry_s, nat_a, nat_b, ih)
                    // (T,F,T): sum=0, co=1 — the +1 of ci propagates into the carry
                    case (true, false, true) =>
                        let ret: Eq(s1, double_a + (double_b + 1) + 1) =
                            calc {
                                double(sum_x) + double(pow2(m)) * carry_s = double(result_r + 1) by double_step(m, sum_x, carry_s, result_r + 1, ih)
                                double(nat_a + nat_b + 1) = double(nat_a) + double(nat_b) + 2 by double_add_one(nat_a, nat_b)
                                double(nat_a) + double(nat_b) + 2 = double(nat_a) + (double(nat_b) + 1) + 1 by symm(rearrange2_r(double_a, double_b))
                            };
                        ret
                    // (T,T,F): sum=0, co=1 — same, with the carried 2 in the middle
                    case (true, true, false) =>
                        let ret: Eq(s1, (double_a + 1) + double_b + 1) =
                            calc {
                                double(sum_x) + double(pow2(m)) * carry_s = double(result_r + 1) by double_step(m, sum_x, carry_s, result_r + 1, ih)
                                double(nat_a + nat_b + 1) = double(nat_a) + double(nat_b) + 2 by double_add_one(nat_a, nat_b)
                                double(nat_a) + double(nat_b) + 2 = (double(nat_a) + 1) + double(nat_b) + 1 by symm(rearrange3_r(double_a, double_b))
                            };
                        ret
                    // (T,T,T): sum=1, co=1 — both +1s and the carry: +2 shifted up, +1 kept
                    case (true, true, true) =>
                        let ret: Eq(s2, ((double_a + 1) + (double_b + 1)) + 1) =
                            calc {
                                (double(sum_x) + 1) + double(pow2(m)) * carry_s = double(result_r + 1) + 1 by add1_step(m, sum_x, carry_s, result_r + 1, ih)
                                double(nat_a + nat_b + 1) + 1 = ((double(nat_a) + 1) + (double(nat_b) + 1)) + 1 by add_right_eq(double(nat_a + nat_b + 1), (double_a + 1) + (double_b + 1), 1, trans(double_add_one(nat_a, nat_b), symm(add_succ_succ(double_a, double_b))))
                            };
                        ret
                }
        }
    }

// to_nat_snoc: appending a bit at the MSB side gives it weight 2^len:
//   to_nat(snoc(v, x)) = to_nat(v) + pow2(len) * bool_to_nat(x)
// Proved by induction on len, with the head bit deciding double vs double+1.
def to_nat_snoc[len: Nat](v: Vec[Boolean] len, x: Boolean):
    Eq(to_nat(snoc(v, x)), to_nat(v) + pow2(len) * bool_to_nat(x)) =
    match len {
        case zero => match (v, x) {
            case (nil, false) => rfl
            case (nil, true) => rfl
        }
        case succ(k) => match (v, x) {
            // head bit 0: snoc stays inside the doubled tail
            case (cons(false, ys), false) =>
                cong(double, to_nat_snoc(ys, false))
            // head bit 0, appended bit 1: the weight 2^(k+1) is the doubled tail
            case (cons(false, ys), true) =>
                let r: Eq (double(to_nat(snoc(ys, true)))) (double(to_nat(ys)) + double(pow2(k))) = calc {
                    double(to_nat(snoc(ys, true))) = double(to_nat(ys) + pow2(k) * bool_to_nat(true)) by cong(double, to_nat_snoc(ys, true))
                    double(to_nat(ys) + pow2(k) * bool_to_nat(true)) = double(to_nat(ys)) + double(pow2(k)) by double_distrib(to_nat(ys), pow2(k))
                };
                r
            // head bit 1, appended bit 0: double + 1
            case (cons(true, ys), false) =>
                cong_succ(cong(double, to_nat_snoc(ys, false)))
            // head bit 1, appended bit 1: (2*tail + 1) + 2^(k+1) = 2*(tail + 2^k) + 1
            case (cons(true, ys), true) =>
                calc {
                    succ(double(to_nat(snoc(ys, true)))) = succ(double(to_nat(ys) + pow2(k) * bool_to_nat(true))) by cong_succ(cong(double, to_nat_snoc(ys, true)))
                    double(to_nat(ys) + pow2(k)) + 1 = (double(to_nat(ys)) + 1) + double(pow2(k)) by symm(add1_step(k, to_nat(ys), 1, to_nat(ys) + pow2(k), rfl))
                }
        }
    }

// vec_add_correct: the full-width adder is correct:
//   to_nat(vec_add(a, b)) = to_nat(a) + to_nat(b)
// i.e. vec_add's (len+1)-bit result evaluates to the exact sum.
// Proof: to_nat_snoc (the appended carry has weight 2^len) followed
// by vec_adder_correct with ci = false.
def vec_add_correct[len: Nat](a: Vec[Boolean] len, b: Vec[Boolean] len):
    Eq(to_nat(vec_add(a, b)), to_nat(a) + to_nat(b)) =
    calc {
        to_nat(vec_add(a, b)) = to_nat(vec_adder(false, a, b)._1) + pow2(len) * bool_to_nat(vec_adder(false, a, b)._2) by to_nat_snoc(vec_adder(false, a, b)._1, vec_adder(false, a, b)._2)
        to_nat(vec_adder(false, a, b)._1) + pow2(len) * bool_to_nat(vec_adder(false, a, b)._2) = to_nat(a) + to_nat(b) + bool_to_nat(false) by vec_adder_correct(false, a, b)
    }

// ============================================================
// 5. Demo: concrete instantiations (fully checked at compile time)
// ============================================================

// 0-bit addition: empty vectors — the theorem reduces to rfl.
println(vec_adder_correct(true, nil, nil))

// 2-bit addition (head = LSB): 0b01 + 0b11 = 0b100 (1 + 3 = 4).
// Prints the Eq proof term for the concrete inputs (normalizes to refl(4)).
println(vec_add_correct(cons(true, cons(false, nil)), cons(true, cons(true, nil))))

println("=== adder_proof.typort loaded ===")

`
          ),
                    (e.file_hdl_12_memory =
            `

// ============================================================
// HDL Example 12: 内存 (Memory)
//
//   let myRam = memUInt(8, 64)      64 × 8 位内存（自动命名）
//   let myBits = memBits(4, 16)     16 × 4 位内存
//   let myFlag = memBool(16)        16 个 1 位标志位
//   myRam.write(addr, data, en)     同步写端口
//   let rd = myRam.readSync(addr)   同步读（生成寄存器，按 bn 命名）
//   let rd = myRam.readAsync(addr)  组合读（返回 mem[addr] 表达式）
//   let rd = myRam.readSyncCC(addr, cd) 跨时钟域读
//
// NOTE: debug（cargo test）构建对 module 体内的大 Nat 字面量有栈深度限制
// （与 Mem 无关，\`createWidth("x", 256)\` 同样触发）；发布构建无此问题。
// ============================================================

module memWriteRead {
    input addr = UInt[8]
    input d = UInt[8]
    input en = Bool
    output out = UInt[8]
    let myRam = memUInt(8, 64)
    myRam.write(addr, d, en)
    let rd = myRam.readSync(addr)
    // 同步读结果引到输出端口（否则 rd 是没人读的死信号）
    out := rd
}
println("=== 12a: memWriteRead (同步写 + 同步读) ===")
println(moduleTreeVL(memWriteRead.create.tree))

module memAsyncRead {
    input addr = UInt[8]
    output out = UInt[8]
    let myRam = memUInt(8, 32)
    let rd = myRam.readAsync(addr)
    out := rd
}
println("=== 12b: memAsyncRead (组合读) ===")
println(moduleTreeVL(memAsyncRead.create.tree))

module memMixedTypes {
    input baddr = UInt[8]
    input bd = Bits[4]
    input faddr = UInt[8]
    input fd = Bool
    input fen = Bool
    // 两种内存的同步读结果都引到输出端口（否则 brd/frd 是死信号）
    output bout = Bits[4]
    output fout = Bool
    let myBits = memBits(4, 16)
    myBits.write(baddr, bd, Bool.mk(None, literal(1)))
    let brd = myBits.readSync(baddr)
    bout := brd

    let myFlag = memBool(16)
    myFlag.write(faddr, fd, fen)
    let frd = myFlag.readSync(faddr)
    fout := frd
}
println("=== 12c: memMixedTypes (Bits/Bool 内存) ===")
println(moduleTreeVL(memMixedTypes.create.tree))

module memReadInWhen {
    input addr = UInt[8]
    input d = UInt[8]
    input en = Bool
    output out = UInt[8]
    let myRam = memUInt(8, 16)
    when en {
        myRam.write(addr, d, en)
    }
    // 内存必须被读一次（否则是死内存）：组合读出 when 内写入的数据
    let rd = myRam.readAsync(addr)
    out := rd
}
println("=== 12d: memReadInWhen (when 内写内存) ===")
println(moduleTreeVL(memReadInWhen.create.tree))

`
          ),
          (e.file_hdl_13_adder_tree =
            `

// ============================================================
// HDL Example 13: 加法树 (Adder Tree) — 位宽随深度增长
//
//   对 Vec[UInt[w]] 构造加法树：
//     adder_tree_step  一层：相邻元素两两 (a +^ b)，奇数个时末元素
//                      补一个 0 位（Bool ## UInt 加宽 1 位）
//     adder_tree       递归合并到只剩 1 个元素
//   结果位宽 = w + log2Up(size)（size ≥ 1，log2Up = ceil(log2)）
//
//   递归产生的位宽是嵌套公式（w + log2Up (div2Up (len + 1) + 1)
//   这种形状），最终用 .cast + Eq 证明（core/eq.typort 的 Cast
//   trait）把它精确地变成 w + log2Up size：
//     def cast(prove: Eq(Self, U)): U
//   UInt 不再有自己特殊的 cast（旧的 Le 证明版本已删除），一切
//   类型转换都走这个等宽证明。
// ============================================================

// 奇数个元素时，把最后那个元素补一个 0 位：
// Bool ## UInt[width] : UInt[width + 1]（hdl-ops.typort 的 Cat 实现）
def widenOne[width: Nat](x: UInt[width]): UInt[width + 1] =
    Bool.mk(None, literal(0)) ## x

// 一层加法树：相邻元素用 +^（结果位宽 +1）。
// len 个元素配对后剩 div2Up len 个（div2Up = ceil(len/2)，hdl-core.typort）。
def adder_tree_step[width: Nat, len: Nat](x: Vec[UInt[width]] len): Vec[UInt[width + 1]] (div2Up len) =
    match x {
        case cons(a, cons(b, tail)) => (a +^ b) :: (adder_tree_step tail)
        case cons(a, nil) => (widenOne a) :: nil
        case nil => nil
    }

// ---- 位宽引理（calc 形式）----
// 递归一步后位宽 +1 出现在类型的最外层括号：
//   (width + 1) + log2Up len   （递归调用的结果位宽）
//   (width + log2Up len) + 1   （把它“挪进”log2Up 之后）
// 两者定义性相等（Nat 加法对第二个参数归纳），核心一步是
// add_succ_left： (succ width) + L = succ (width + L)。
def uint_cast_prove[width: Nat, len: Nat]: Eq (UInt[(width + 1) + (log2Up len)]) (UInt[(width + (log2Up len)) + 1]) =
    calc {
        UInt[(width + 1) + (log2Up len)] = UInt[(width + (log2Up len)) + 1] by cong (t => UInt[t]) (add_succ_left (width) (log2Up len))
    }

// 用 Eq 证明做等宽转换的小助手：就是 core/eq.typort 的 Cast trait 的
// .cast（def cast(prove: Eq(Self, U)): U），套上一层命名参数是为了
// 在顶层作用域调用——在 match 分支深处直接写 \`t.cast (uint_cast_prove[width])\`
// 会让 trait 实例元变量带着不完整的作用域 spine 悬空（编译器 bug，
// 顶层 no_metas 检查时越界）。转换本身没有任何特殊 cast。
def cast_uint[width: Nat, len: Nat](t: UInt[(width + 1) + (log2Up len)]): UInt[(width + (log2Up len)) + 1] =
    t.cast (uint_cast_prove[width])

// 完整加法树：输入至少 1 个元素（Vec[UInt[w]] (len + 1)），
// 结果位宽 w + log2Up (len + 1) = w + log2Up size。
//
// 递归分支：
//   1) 只剩 1 个元素（len = 0）：直接返回，位宽 w + log2Up 1 = w。
//   2) 至少 2 个元素：先做一层配对（adder_tree_step），再递归；
//      递归结果的位宽是 (w + 1) + log2Up (div2Up (len + 1) + 1) 这种
//      嵌套公式，cast_uint 用 uint_cast_prove 把它证明成目标位宽
//      w + log2Up (len + 1)（div2Up/log2Up 的递归定义性归约在
//      unifier 里闭合，证明本身只负责外层加法重排）。
def adder_tree[width: Nat, len: Nat](x: Vec[UInt[width]] (len + 1)): UInt[width + log2Up (len + 1)] =
    match x {
        case cons(a, nil) => a
        case cons(a, cons(b, tail)) =>
            let t = adder_tree[width = width + 1] (adder_tree_step x);
            cast_uint t
    }

// ============================================================
// 使用示例：8 个 UInt[8] 输入 → UInt[8 + log2Up 8] = UInt[11]
// ============================================================

module adderTree8 {
    input a0 = UInt[8]
    input a1 = UInt[8]
    input a2 = UInt[8]
    input a3 = UInt[8]
    input a4 = UInt[8]
    input a5 = UInt[8]
    input a6 = UInt[8]
    input a7 = UInt[8]
    output sum = UInt[11]
    sum := adder_tree (a0 :: a1 :: a2 :: a3 :: a4 :: a5 :: a6 :: a7 :: nil)
}
println("=== 13a: adderTree8 (8 x UInt[8] -> UInt[11]) ===")
println(moduleTreeVL(adderTree8.create.tree))

// 4 个 UInt[16] 输入 → UInt[16 + log2Up 4] = UInt[18]
module adderTree4 {
    input b0 = UInt[16]
    input b1 = UInt[16]
    input b2 = UInt[16]
    input b3 = UInt[16]
    output sum = UInt[18]
    sum := adder_tree (b0 :: b1 :: b2 :: b3 :: nil)
}
println("=== 13b: adderTree4 (4 x UInt[16] -> UInt[18]) ===")
println(moduleTreeVL(adderTree4.create.tree))

// 3 个 UInt[8] 输入（奇数个，触发 widenOne 路径）→ UInt[8 + log2Up 3] = UInt[10]
module adderTree3 {
    input c0 = UInt[8]
    input c1 = UInt[8]
    input c2 = UInt[8]
    output sum = UInt[10]
    sum := adder_tree (c0 :: c1 :: c2 :: nil)
}
println("=== 13c: adderTree3 (3 x UInt[8] -> UInt[10], 奇数个元素) ===")
println(moduleTreeVL(adderTree3.create.tree))

// 运行时验证：log2Up 求值
println(8 + (log2Up 8))
println(16 + (log2Up 4))
println(8 + (log2Up 3))

`
          ),
          (e.file_hdl_11_bundle_deep =
            `

// ============================================================
// HDL Example 11: 深层嵌套 Bundle（SpinalHDL Axi4 风格）
//
// 在三层嵌套下练习 Bundle 的三种能力（与 10-bundle 的 10d/10e 一层
// 嵌套对应）：
//   1. 命名全路径化：嵌套工厂把绑定名前缀沿字段路径逐级下推，
//      \`let m = Axi4.create.asMaster\` 得到 m_aw_lane_data / m_w_lane_data ——
//      即便 aw/w 两个通道的叶子字段同名也不会冲突（3 层以上必须有
//      全路径名，否则重复 wire/端口）。
//   2. 参数沿链下传：Bus.create[32] → Channel[32] → Lane[32]。
//   3. 方向化递归：子 bundle 各自实现 IMasterSlave，父级用
//      out(this.aw) 把整个通道按自己的 asMaster 建；master <> slave
//      单语句全链连通，且只驱动可驱动端口。
//
// 注：此文件独立于 10-bundle，因为多层嵌套的 elaboration 递归深度随
// 文件累积状态增长（测试线程默认 2MiB 栈）；拆开后每个文件都在预算内。
// ============================================================

// 三层嵌套 (SpinalHDL Axi4 ⊃ AxiChannel ⊃ AxiLane 风格):工厂递归逐级创建,
// 绑定名前缀沿字段路径下推,每个叶子得到唯一全路径名——m_aw_lane_data /
// m_w_lane_data 不冲突(即便 aw/w 两个通道的叶子字段同名)。方向由下方
// IMasterSlave 提供:正向 m := s 灌 payload、反向 s := m 补 ready(:= 自动
// 跳过 input 端口 LHS),每个叶子只被驱动一次(无环);11c 用 <> 合成一句。
#[derive(Bundle)]
struct AxiLane {
    data: UInt[8]
    last: Bool
}

#[derive(Bundle)]
struct AxiChannel {
    lane: AxiLane
    valid: Bool
}

#[derive(Bundle)]
struct Axi4 {
    aw: AxiChannel
    w: AxiChannel
    ready: Bool
}

// 三层方向化 (完整 Axi4):子 bundle 各自实现 IMasterSlave,父级用
// out(this.aw)/out(this.w) 把整个通道按自己的 asMaster 方向建、in(this.ready)
// 反之;asSlave 全链翻转。端口名带全路径:master_aw_lane_data (output) vs
// slave_aw_lane_data (input),互不冲突。
impl IMasterSlave for AxiLane {
    def asMaster: AxiLane =
        let _ = out(this.data);
        let _ = out(this.last);
        this
}

impl IMasterSlave for AxiChannel {
    def asMaster: AxiChannel =
        let _ = out(this.lane);
        let _ = out(this.valid);
        this
}

impl IMasterSlave for Axi4 {
    def asMaster: Axi4 =
        let _ = out(this.aw);
        let _ = out(this.w);
        let _ = in(this.ready);
        this
}

module bundleDeep {
    let m = Axi4.create.asMaster
    let s = Axi4.create.asSlave
    m := s
    s := m
}
println("=== 11a: bundleDeep (三层嵌套命名) ===")
println(moduleTreeVL(bundleDeep.create.tree))

// 参数化三层嵌套:宽度参数沿工厂链逐级下传(Bus.create[32] → Channel[32] →
// Lane[32]),命名同样全路径。
#[derive(Bundle)]
struct Lane[w: Nat] {
    data: UInt[w]
    last: Bool
}

#[derive(Bundle)]
struct Channel[w: Nat] {
    lane: Lane[w]
    valid: Bool
}

#[derive(Bundle)]
struct Bus[w: Nat] {
    aw: Channel[w]
    ready: Bool
}

module bundleParamDeep {
    let m = Bus.create[32]
    let s = Bus.create[32]
    // 悬空叶子补方向(方向注解助手 in_u/out_u 重建同名端口,工厂 wire 被
    // 端口遮蔽丢弃):m 侧只被 := 驱动 → 全部 output;s 侧只被 := 读取 →
    // 全部 input,单向 m := s 两侧刚好互补。参数化嵌套链不在调用点走
    // asMaster 分派:impl 参数宽度经嵌套分派会冻结退化成 1 位(HDL004,
    // 见 docs/l13-typeclass-instance-nat-param-bug.md);助手直接取
    // create[32] 实参宽度,[31:0] 得以保留。
    let _ = out_u(m.aw.lane.data)
    let _ = out_bool(m.aw.lane.last)
    let _ = out_bool(m.aw.valid)
    let _ = out_bool(m.ready)
    let _ = in_u(s.aw.lane.data)
    let _ = in_bool(s.aw.lane.last)
    let _ = in_bool(s.aw.valid)
    let _ = in_bool(s.ready)
    m := s
}
println("=== 11b: bundleParamDeep (参数化三层嵌套) ===")
println(moduleTreeVL(bundleParamDeep.create.tree))

// 11c:方向化后的 \`master <> slave\` 单向一次连通全部叶子(等价于 11a 的
// 两次 :=),且只驱动可驱动端口。
module bundleDeepMS {
    let master = Axi4.create.asMaster
    let slave  = Axi4.create.asSlave
    master <> slave
}
println("=== 11c: bundleDeepMS (三层 master/slave 方向化) ===")
println(moduleTreeVL(bundleDeepMS.create.tree))

`
          ),
          (e.file_hdl_14_arithmetic_extra =
            `

// ============================================================
// HDL Example 14: 除法/取模/宽度保持移位/abs/expand
//
//   a / b   UInt/SInt 除法（SpinalHDL: 结果宽 = w(x)）
//   a % b   UInt/SInt 取模
//   a / 3   Nat 字面量除数
//   a |<< sh  a |>> sh   宽度保持变量移位（UInt 移位量，Verilog 原生）
//   sa |>> sh            SInt 算术右移（>>>）
//   sa.abs               绝对值 → UInt[width]（mux 展开）
//   x.expand             扩展 1 位：UInt 零扩展 / SInt 符号扩展 {msb, x}
// ============================================================

module divMod {
    input a = UInt[8]
    input b = UInt[8]
    output q = UInt[8]
    output r = UInt[8]
    input sa = SInt[8]
    input sb = SInt[8]
    output sq = SInt[8]
    output srm = SInt[8]
    output q3 = UInt[8]
    q := a / b
    r := a % b
    sq := sa / sb
    srm := sa % sb
    q3 := a / 3
}
println("=== 14a: divMod (除法/取模) ===")
println(moduleTreeVL(divMod.create.tree))

module varShift {
    input a = UInt[8]
    input sh = UInt[4]
    input b = Bits[8]
    input sa = SInt[8]
    output u1 = UInt[8]
    output u2 = UInt[8]
    output b1 = Bits[8]
    output b2 = Bits[8]
    output s1 = SInt[8]
    output s2 = SInt[8]
    u1 := a |<< sh
    u2 := a |>> sh
    b1 := b |<< sh
    b2 := b |>> sh
    s1 := sa |>> sh
    s2 := sa |<< sh
}
println("=== 14b: varShift (|<< / |>> 宽度保持变量移位) ===")
println(moduleTreeVL(varShift.create.tree))

module absExpand {
    input sa = SInt[8]
    output a = UInt[8]
    output ue = UInt[9]
    output se = SInt[9]
    a := sa.abs
    ue := sa.asUInt.expand
    se := sa.expand
}
println("=== 14c: absExpand (abs / expand) ===")
println(moduleTreeVL(absExpand.create.tree))

`
          ),
          (e.file_hdl_15_inout =
            `

// ============================================================
// HDL Example 15: inout 双向端口 (tri-state)
//
//   inout io = UInt[8]          模块端口: inout wire [7:0] io
//   inout flag = Bool           inout wire flag
//   inout sio = SInt[8]         inout wire signed [7:0] sio
//   autoUIntInOut(8)            自动命名 inout 信号
//   inout_u(t)                  方向注解
//
//  Bundle 的 inout 方向在 impl IMasterSlave 的 asMaster 里用
//  inout(this.<field>) 声明：asMaster / asSlave 两侧都生成真正的 inout
//  端口（不再按 input 处理）；\`master <> slave\` 对连仍跳过 inout/input
//  LHS（模块不驱动自己的双向引脚 —— 三态驱动不在本模型内），只有
//  dir 字段以 master_dir(input) → slave_dir(output) 直通相连。
// ============================================================

module inoutPorts {
    input a = UInt[8]
    output b = UInt[8]
    inout io = UInt[8]
    inout flag = Bool
    inout sio = SInt[8]
    let inside = UInt[8]
    b := a + inside
    inside := a
}
println("=== 15a: inoutPorts (inout 端口声明) ===")
println(moduleTreeVL(inoutPorts.create.tree))

module inoutAuto {
    let myio = autoUIntInOut(8)
    let myflag = autoBoolInOut
    // readback 引到输出端口（内部线无人读取会报 HDL002 死信号）
    let readback = autoUIntOutput(8)
    readback := myio
}
println("=== 15b: inoutAuto (auto*InOut 自动命名) ===")
println(moduleTreeVL(inoutAuto.create.tree))

#[derive(Bundle)]
struct TriBus {
    data: UInt[8]
    valid: Bool
    dir: Bool
}

impl IMasterSlave for TriBus {
    def asMaster: TriBus =
        let _ = inout(this.data);
        let _ = inout(this.valid);
        let _ = in(this.dir);
        this
}

module bundleInOut {
    let master = TriBus.create.asMaster
    let slave = TriBus.create.asSlave
    master <> slave
}
println("=== 15c: bundleInOut (Bundle inout 字段) ===")
println(moduleTreeVL(bundleInOut.create.tree))

`
          ),
          (e.file_hdl_16_counter =
            `

// ============================================================
// HDL Example 16: Counter（SpinalHDL 风格计数器）
//
//   let cnt = counter(8)         自增计数器：每周期 cnt := cnt + 1
//   let cnt = counterInc(8, en)  使能计数：when(en) { cnt := cnt + 1 }
//   cnt.value         计数值（reg [w-1:0]，按 let 绑定名自动命名）
//   cnt.willOverflow  组合信号：value 全 1（(~value == 0)，下一周期回绕）
// ============================================================

module counterFree {
    let cnt = counter(8)
    output wrap = Bool
    output doubled = UInt[9]
    wrap := cnt.willOverflow
    doubled := cnt.value +^ cnt.value
}
println("=== 16a: counterFree (自增计数器) ===")
println(moduleTreeVL(counterFree.create.tree))

module counterGated {
    input en = Bool
    let cnt = counterInc(8, en)
    output wrap = Bool
    wrap := cnt.willOverflow
}
println("=== 16b: counterGated (使能计数) ===")
println(moduleTreeVL(counterGated.create.tree))

module counterChain {
    // 两计数器串接：低位满 256 后驱动高位使能
    let lo = counter(8)
    let hi = counterInc(8, lo.willOverflow)
    output count = UInt[16]
    count := hi.value ## lo.value
}
println("=== 16c: counterChain (计数器串接) ===")
println(moduleTreeVL(counterChain.create.tree))

`
          ),
          (e.file_hdl_17_output_reg =
            `

// ============================================================
// HDL Example 17: output reg 寄存器输出端口
//
//   output reg x = UInt[8]            模块端口: output reg [7:0] x
//   output reg x = UInt[8] init 5     同上 + 异步复位初值 5
//   output reg s = SInt[8]            output reg signed [7:0] s
//   output reg b = Bits[8] init 1     Bits 输出寄存器（复位初值 1）
//   output reg f = Bool               output reg f（1 位无范围）
//
// \`output reg\` = 输出端口 + 寄存器：
//   - 端口声明强制 \`output reg\`（不像 \`output\` 那样按 when 赋值推断
//     wire/reg —— 不依赖 when 也有 reg 声明，端口自文档化）
//   - \`x := next\` 通过 isRegExpr 走 regAssign → always @(posedge clk)
//   - \`init v\` → 异步复位块 \`if (reset) x <= v;\`
//   - 自动补 clk / reset 输入端口
// 注意（宏匹配顺序）：\`output reg\` 端口须声明在普通 typed 端口之前，
// 普通 typed 端口在 Bool 端口之前；带 init 的端口须独占一行。
// ============================================================

module counterOut {
    output reg count = UInt[8] init 0
    output reg flag = Bool
    input en = Bool
    let next = UInt[8]
    next := count + 1
    when (en) {
        count := next
        flag := !flag
    }
}
println("=== 17a: counterOut (端口区 output reg + init + when 驱动) ===")
println(moduleTreeVL(counterOut.create.tree))

module signedOut {
    output reg s = SInt[8] init 0
    output reg b = Bits[8]
    let inc = SInt[8]
    inc := s + 1
    s := inc
    b := s.asBits
}
println("=== 17b: signedOut (SInt / Bits output reg) ===")
println(moduleTreeVL(signedOut.create.tree))

module bodyOutReg {
    input a = UInt[8]
    output reg r = UInt[8] init 3
    r := a
}
println("=== 17c: bodyOutReg (体内 output reg —— Expr 宏) ===")
println(moduleTreeVL(bodyOutReg.create.tree))

module autoOutRegDemo {
    output reg c = UInt[8]
    let v = autoUIntOutReg(8)
    let w = autoBoolOutReg
    // v 须有真实驱动（output reg 未驱动会报 HDL003）
    v := v + 1
    c := v
    w := true
}
println("=== 17d: autoOutRegDemo (auto*OutReg 自动命名) ===")
println(moduleTreeVL(autoOutRegDemo.create.tree))

`
          ),
          (e.file_hdl_18_utils =
            `

// ============================================================
// HDL Example 18: utils — 组合逻辑工具（SpinalHDL lib/Utils 复刻）
//
//   reverse / propagateOnes            位反转、前缀传播
//   countOne / countOneUInt / clz / ctz / majorityVote
//   uintToOh / ohToUInt / ohIsLegal / ohMaskingFirst / ohMaskingLast
//   priorityMux / muxOH / ohMuxOr / min / max / clamp
//   toGray / fromGray / endiannessSwap
//   delay / history / delayEvent / timeout
//   counterMod / counterIncMod / counterUpDown / downCounter /
//   oneHotCounter / johnsonCounter
// ============================================================

module utilsRev {
    input a = Bits[8]
    output r = Bits[8]
    input u = UInt[8]
    output ru = UInt[8]
    output p = Bits[8]
    output p2 = Bits[8]
    r := reverse(a)
    ru := reverse(u)
    p := propagateOnes(a, false)
    p2 := propagateOnes(a, true)
}
println("=== 18a: reverse / propagateOnes ===")
println(moduleTreeVL(utilsRev.create.tree))

module utilsCount {
    input a = Bits[8]
    output c = UInt[4]
    input u = UInt[8]
    output cu = UInt[4]
    output v = UInt[4]
    output cl = UInt[4]
    output ct = UInt[4]
    output mv = Bool
    c := countOne(a)
    cu := countOneUInt(u)
    v := countOne(a)
    cl := countLeadingZeroes(a)
    ct := countTrailingZeroes(a)
    mv := majorityVote(a)
}
println("=== 18b: countOne / clz / ctz / majorityVote ===")
println(moduleTreeVL(utilsCount.create.tree))

module utilsOh {
    input a = Bits[8]
    let oh = Bits[8]
    output idx = UInt[3]
    output legal = Bool
    output first = Bits[8]
    output last = Bits[8]
    oh := uintToOh(a.slice[2, 0].asUInt)
    idx := ohToUInt(oh)
    legal := ohIsLegal(oh)
    first := ohMaskingFirst(oh)
    last := ohMaskingLast(oh)
}
println("=== 18c: uintToOh / ohToUInt / ohIsLegal / ohMasking ===")
println(moduleTreeVL(utilsOh.create.tree))

module utilsMux {
    input sel = Bits[4]
    input a = UInt[8]
    input b = UInt[8]
    input c = UInt[8]
    input d = UInt[8]
    input dflt = UInt[8]
    output pm = UInt[8]
    output m = UInt[8]
    output o = UInt[8]
    output mn = UInt[8]
    output mx = UInt[8]
    output cl = UInt[8]
    pm := priorityMux(sel, cons(a, cons(b, cons(c, cons(d, nil)))), dflt)
    m := muxOH(sel, cons(a, cons(b, cons(c, cons(d, nil)))))
    o := ohMuxOr(sel, cons(a, cons(b, cons(c, cons(d, nil)))))
    mn := min(a, b)
    mx := max(a, b)
    cl := clamp(a, b, c)
}
println("=== 18d: priorityMux / muxOH / ohMuxOr / min / max / clamp ===")
println(moduleTreeVL(utilsMux.create.tree))

module utilsGray {
    input x = UInt[8]
    let g = Bits[8]
    output back = UInt[8]
    input es = Bits[16]
    output sw = Bits[16]
    output swu = UInt[16]
    g := toGray(x)
    back := fromGray(g)
    sw := endiannessSwap(es, 8)
    swu := endiannessSwapUInt(es.asUInt, 8)
}
println("=== 18e: gray / endiannessSwap ===")
println(moduleTreeVL(utilsGray.create.tree))

module utilsReg {
    input a = UInt[8]
    output d1 = UInt[8]
    output h = UInt[8]
    input ev = Bool
    output de = Bool
    // historyUInt 内部多产生一级最深延迟寄存器 history_1（不进入返回 Vec），
    // 以同名 output reg 端口取出该内部寄存器，避免死寄存器
    output reg history_1 = UInt[8]
    let tm = timeout(8)
    output ts = Bool
    d1 := delayUInt(a, 2)
    // 触发 history 移位链生成（history_3 / history_2 / history_1）
    let hv = historyUInt(a, 3)
    // h 直接观测链上最深一级：a 延迟 3 拍
    h := history_1
    de := delayEvent(ev, 4)
    ts := tm.state
}
println("=== 18f: delay / history / delayEvent / timeout ===")
println(moduleTreeVL(utilsReg.create.tree))

module utilsCounters {
    let cm = counterMod(10)
    output cmv = UInt[4]
    let cmo = Bool
    input en = Bool
    let ci = counterIncMod(10, en)
    let ud = counterUpDown(10, en, cmo)
    let dc = downCounter(10)
    let ohc = oneHotCounter(4)
    let jc = johnsonCounter(4)
    output jv = Bits[4]
    output ohv = Bits[4]
    output udv = UInt[4]
    cmv := cm.value
    cmo := cm.willOverflow
    jv := jc.value
    ohv := ohc.value
    udv := ud.value
}
println("=== 18g: counter 家族 ===")
println(moduleTreeVL(utilsCounters.create.tree))

`
          ),
          (e.file_hdl_19_stream =
            `

// ============================================================
// HDL Example 19: Stream 框架（SpinalHDL lib/Stream 复刻）
//   m2sPipe / s2mPipe / halfPipe / throwWhen / haltWhen
//   StreamFifo / StreamMux / StreamDemux / StreamArbiter / StreamFork
//   Fragment（last）/ Flow
//
// 信号方向约定：valid/payload 流出模块 → output，ready 流入 → input；
// 模块驱动的 ready（反压）→ output。仅在级联中间传递的线网保持 let。
// ============================================================

// 19a-1：m2sPipe → s2mPipe 级联。
//   push 是输入流：valid/data 从外部进入，ready 由 m2sPipe 驱动后输出；
//   p2 是末级输出流，其 ready 由下游（外部）输入。
module streamPipe {
    input push_valid = Bool
    output push_ready = Bool
    input push_data = UInt[8]
    // 与 s2mPipe 内部创建的同名线网同名：端口声明优先，遮蔽内部 wire
    input p2_ready = Bool
    let push = Stream.mk(push_valid, push_ready, push_data)
    let p1 = streamM2sPipeUInt(push)
    let p2 = streamS2mPipeUInt(p1)
    output outValid = Bool
    output outData = UInt[8]
    outValid := p2.valid
    outData := p2.payload
}

// 19a-2：halfPipe → throwWhen → haltWhen 级联。
//   各级 ready 只有一个驱动源（若并联作用在同一个 push 上，
//   push_ready 会被多个工具无条件驱动，产生多驱动冲突）；
//   hw 是末级输出流，其 ready（hw_ready）由下游（外部）输入。
module streamHalfPipeEx {
    input push_valid = Bool
    output push_ready = Bool
    input push_data = UInt[8]
    input cond = Bool
    // 与 haltWhen 内部创建的同名线网同名：端口声明优先，遮蔽内部 wire
    input hw_ready = Bool
    let push = Stream.mk(push_valid, push_ready, push_data)
    let h1 = streamHalfPipeUInt(push)
    let tw = streamThrowWhenUInt(h1, cond)
    let hw = streamHaltWhenUInt(tw, cond)
    output hValid = Bool
    output twValid = Bool
    output hwValid = Bool
    output outData = UInt[8]
    hValid := h1.valid
    twValid := tw.valid
    hwValid := hw.valid
    outData := hw.payload
}
println("=== 19a: 管线原语 ===")
println(moduleTreeVL(streamPipe.create.tree))
println(moduleTreeVL(streamHalfPipeEx.create.tree))

// 19b：push 侧 valid/data 输入、ready 输出（反压）；
//      pop 侧 valid/data 输出、ready 输入；occupancy 输出。
module streamFifoEx {
    input pushValid = Bool
    output pushReady = Bool
    input pushData = UInt[8]
    output popValid = Bool
    input popReady = Bool
    output popData = UInt[8]
    output occ = UInt[3]
    let push = Stream.mk(pushValid, pushReady, pushData)
    let pop = Stream.mk(popValid, popReady, popData)
    occ := streamFifoConnect[8][3][3](4, push, pop)
}
println("=== 19b: StreamFifo ===")
println(moduleTreeVL(streamFifoEx.create.tree))

// 19c：a/b 两路为输入流，mux 输出 m 也是流；
//      aReady/bReady 由 mux 反压驱动 → 输出，mReady 来自下游 → 输入。
module streamMuxEx {
    input aValid = Bool
    output aReady = Bool
    input aData = UInt[8]
    input bValid = Bool
    output bReady = Bool
    input bData = UInt[8]
    input sel = UInt[1]
    input mReady = Bool
    output mValid = Bool
    output mData = UInt[8]
    let sa = Stream.mk(aValid, aReady, aData)
    let sb = Stream.mk(bValid, bReady, bData)
    let m = streamMuxUInt(sel, cons(sa, cons(sb, nil)))
    mValid := m.valid
    mData := m.payload
    m.ready := mReady
}
println("=== 19c: StreamMux ===")
println(moduleTreeVL(streamMuxEx.create.tree))

// 19d：si 为输入流；demux 内部由 inReady 推出各分支 ready
//      （demux_ready_0/1 为级联中间线网，保持 let），
//      分支 ready/valid/payload 均观测为输出。
module streamDemuxEx {
    input inValid = Bool
    input inReady = Bool
    input inData = UInt[8]
    input sel = UInt[1]
    output o0Valid = Bool
    output o0Data = UInt[8]
    output o0Ready = Bool
    output o1Valid = Bool
    output o1Ready = Bool
    let si = Stream.mk(inValid, inReady, inData)
    let outs = streamDemuxUInt(si, sel, 2)
    o0Valid := outs.at(0, si).valid
    o0Data := outs.at(0, si).payload
    o0Ready := outs.at(0, si).ready
    o1Valid := outs.at(1, si).valid
    o1Ready := outs.at(1, si).ready
}
println("=== 19d: StreamDemux ===")
println(moduleTreeVL(streamDemuxEx.create.tree))

// 19e：与 19c 同构：两路请求输入、仲裁结果输出。
module streamArbEx {
    input aValid = Bool
    output aReady = Bool
    input aData = UInt[8]
    input bValid = Bool
    output bReady = Bool
    input bData = UInt[8]
    input mReady = Bool
    output mValid = Bool
    output mData = UInt[8]
    let sa = Stream.mk(aValid, aReady, aData)
    let sb = Stream.mk(bValid, bReady, bData)
    let m = streamArbiterLowerPriorityUInt(cons(sa, cons(sb, nil)))
    mValid := m.valid
    mData := m.payload
    m.ready := mReady
}
println("=== 19e: StreamArbiter ===")
println(moduleTreeVL(streamArbEx.create.tree))

// 19f：si 为输入流；fork 要求各分支 ready 同时为真，
//      fork_ready_0/1 是各分支回传的 ready（外部输入，端口优先遮蔽内部线网），
//      inReady 由 fork 汇聚驱动 → 输出（反压）。
module streamForkEx {
    input inValid = Bool
    output inReady = Bool
    input inData = UInt[8]
    input fork_ready_0 = Bool
    input fork_ready_1 = Bool
    output o0Valid = Bool
    output o1Valid = Bool
    output o0Data = UInt[8]
    let si = Stream.mk(inValid, inReady, inData)
    let outs = streamForkUInt[2](si)
    o0Valid := outs.at(0, si).valid
    o1Valid := outs.at(1, si).valid
    o0Data := outs.at(0, si).payload
}
println("=== 19f: StreamFork ===")
println(moduleTreeVL(streamForkEx.create.tree))

// 19g：Stream → Fragment → Stream 往返；
//      str_ready 是回转后流的 ready（下游外部输入，端口优先遮蔽内部线网），
//      backData 把 payload 完整带回（否则 inData 无人读取）。
module streamFragEx {
    input inValid = Bool
    output inReady = Bool
    input inData = UInt[8]
    input str_ready = Bool
    output fragValid = Bool
    output fragLast = Bool
    output backValid = Bool
    output backData = UInt[8]
    let si = Stream.mk(inValid, inReady, inData)
    let frag = streamToFragmentUInt(si)
    fragValid := frag.valid
    fragLast := frag.last
    let back = fragmentToStreamUInt(frag)
    backValid := back.valid
    backData := back.payload
}
println("=== 19g: Fragment ===")
println(moduleTreeVL(streamFragEx.create.tree))

// 19h：两路 Flow 与 select 均来自外部 → 输入；合并结果 → 输出。
module flowEx {
    input fv = Bool
    input fd = UInt[8]
    input gv = Bool
    input gd = UInt[8]
    input sel = UInt[1]
    output mValid = Bool
    output mData = UInt[8]
    let fa = Flow.mk(fd, fv)
    let fb = Flow.mk(gd, gv)
    let m = flowMuxUInt(sel, cons(fa, cons(fb, nil)))
    mValid := m.valid
    mData := m.payload
}
println("=== 19h: FlowMux ===")
println(moduleTreeVL(flowEx.create.tree))

`
          ),
          (e.file_hdl_20_misc =
            `

// ============================================================
// HDL Example 20: misc — io/math/logic/fsm/bus/crossclock
//   （Wave 3/4/5/6 复刻组件）
//
//   TriState / Gpio / Bcd / Divider           IO 与数学组件
//   StateMachine / Prescaler / Timer / InterruptCtrl / Watchdog
//   Apb3 / AxiLite4 / Wishbone / AvalonST / Axi4Stream   总线
//   BufferCC                                  单拍采样跨时钟
// ============================================================

module miscTriState {
    let t = TriStateBits.mk(newBitsNamed("t_read", 8), newBitsNamed("t_write", 8), newBoolNamed("t_we"))
    let m = triStateAsMasterBits(t)
    let r = Bits[8]
    r := m.read
    // master 视角的 write/writeEnable 由本模块驱动：读回值回环写出、恒使能
    m.write := r
    m.writeEnable := true
}
println("=== 20a: TriState ===")
println(moduleTreeVL(miscTriState.create.tree))

module miscGpio {
    // 只被逻辑读取、从未驱动 → input 端口（HDL001）
    input pinRead = Bits[4]
    input clr = Bits[4]
    // gpioCtrl 要读的输出寄存器：模块内无配置逻辑，作为 input 供其读取
    input g_out = Bits[4]
    input g_oe = Bits[4]
    // 只被驱动、模块内无人读取 → output 端口（HDL002）
    output pinWrite = Bits[4]
    output pinWE = Bits[4]
    output sampled = Bits[4]
    output irq = Bits[4]
    let io = GpioIO.mk(pinRead, pinWrite, pinWE, newBitsNamed("g_in", 4), g_out, g_oe, newBitsNamed("g_int", 4))
    let _d = gpioCtrl(io, clr)
    sampled := io.input
    irq := io.interrupts
}
println("=== 20b: Gpio ===")
println(moduleTreeVL(miscGpio.create.tree))

module miscBcd {
    // 只被加法/判零逻辑读取、从未驱动 → input 端口（HDL001）
    input a = UInt[4]
    input b = UInt[4]
    input cin = Bool
    input bcd_d = Bits[8]
    // 只被驱动、模块内无人读取 → output 端口（HDL002）
    output s = UInt[4]
    output co = Bool
    output isz = Bool
    let r = bcdAddDigit(a, b, cin)
    s := r.sum
    co := r.carry
    isz := bcdIsZero(Bcd.mk[2](bcd_d))
}
println("=== 20c: Bcd ===")
println(moduleTreeVL(miscBcd.create.tree))

module miscDivider {
    // 除法命令 valid/numerator/denominator 来自外部 → input 端口（HDL001）
    input cmdValid = Bool
    input num = UInt[8]
    input den = UInt[8]
    // 命令握手回压、运算结果与忙状态由核心计算 → output 端口（HDL002）
    output cmdReady = Bool
    output rspValid = Bool
    output quo = UInt[8]
    output rem = UInt[8]
    output busy = Bool
    let cmd = DividerCmd.mk(cmdValid, num, den, cmdReady)
    let rsp = DividerRsp.mk(rspValid, quo, rem)
    let fsm = dividerCore(cmd, rsp)
    // cmd.ready 由核心的 !busy 反压真实驱动
    cmd.ready := fsm.cmdReady
    busy := fsm.busy
}
println("=== 20d: Divider ===")
println(moduleTreeVL(miscDivider.create.tree))

module miscFsm {
    // go 只被状态转移条件读取、从未驱动 → input 端口（HDL001）
    input go = Bool
    let sm = stateMachine[2](4)
    // 状态观察口只被驱动、无人读取 → output 端口（HDL002）
    output s0 = Bool
    output s1 = Bool
    s0 := stateIs(sm, 0)
    s1 := stateIs(sm, 1)
    when go {
        let _d = stateGoto(sm, 1)
    }
}
println("=== 20e: StateMachine ===")
println(moduleTreeVL(miscFsm.create.tree))

module miscPrescaler {
    // 分频/定时限值只被计数逻辑读取、从未驱动 → input 端口（HDL001）
    input lim = UInt[8]
    let p = prescaler(lim)
    let t = timer(Bool.mk(None, literal(1)), Bool.mk(None, literal(0)), lim)
    // 溢出脉冲 / 到期标志 / 计数值只被驱动 → output 端口（HDL002）
    output ov = Bool
    output tf = Bool
    output tv = UInt[8]
    ov := p.overflow
    tf := t.full
    tv := t.value
}
println("=== 20f: Prescaler / Timer ===")
println(moduleTreeVL(miscPrescaler.create.tree))

module miscInterrupts {
    // 中断源 / 清除 / 掩码只被控制器读取、从未驱动 → input 端口（HDL001）
    input inputs = Bits[4]
    input clears = Bits[4]
    input masks = Bits[4]
    // 挂起向量与看门狗超时只被驱动、无人读取 → output 端口（HDL002）
    output pend = Bits[4]
    output wd = Bool
    pend := interruptCtrl(inputs, clears, masks)
    wd := watchdog(Bool.mk(None, literal(0)), UInt.mk[4](None, literal(7)))
}
println("=== 20g: InterruptCtrl / Watchdog ===")
println(moduleTreeVL(miscInterrupts.create.tree))

module busApb3 {
    // 寄存器读回观察口：只被驱动、无人读取 → output 端口（HDL002）
    output r0v = UInt[32]
    let bus = Apb3.mk(newUIntNamed("PADDR", 32), newBitsNamed("PSEL", 1), newBoolNamed("PENABLE"),
                      newBoolNamed("PREADY"), newBoolNamed("PWRITE"), newBitsNamed("PWDATA", 32),
                      newBitsNamed("PRDATA", 32), newBoolNamed("PSLVERROR"))
    let sbus = apb3AsSlave(bus)
    // 本模块即从端：恒就绪、无从端错误（从端视角的输出必须有真实驱动）
    sbus.PREADY := true
    sbus.PSLVERROR := false
    let r0 = newUIntRegNamed("r0", 32)
    let bank = Apb3RegBank.mk(sbus)
    let _d = bank.regReadWrite(0, r0)
    let _d = bank.readDefault()
    r0v := r0
}
println("=== 20h: APB3 + 寄存器组 ===")
println(moduleTreeVL(busApb3.create.tree))

module busAxiLite {
    // 五个通道的载荷 / 握手来自外部总线、被观察逻辑读取 → input 端口（HDL001/002）
    input ax_addr = UInt[32]
    input ax_prot = Bits[3]
    input w_data = Bits[32]
    input w_strb = Bits[4]
    input b_resp = Bits[2]
    input r_data = Bits[32]
    input r_resp = Bits[2]
    input aw_v = Bool
    input aw_r = Bool
    input w_v = Bool
    input w_r = Bool
    input b_v = Bool
    input b_r = Bool
    input ar_v = Bool
    input ar_r = Bool
    input r_v = Bool
    input r_r = Bool
    let ax = AxiLite4Ax.mk(ax_addr, ax_prot)
    let w = AxiLite4W.mk(w_data, w_strb)
    let b = AxiLite4B.mk(b_resp)
    let r = AxiLite4R.mk(r_data, r_resp)
    let bus = AxiLite4.mk(Stream.mk(aw_v, aw_r, ax),
                          Stream.mk(w_v, w_r, w),
                          Stream.mk(b_v, b_r, b),
                          Stream.mk(ar_v, ar_r, ax),
                          Stream.mk(r_v, r_r, r))
    // 观察输出：握手对 / 载荷只被驱动、无人读取 → output 端口（HDL002）
    output awHs = Bits[2]
    output awAddr = UInt[32]
    output awProt = Bits[3]
    output wHs = Bits[2]
    output wData = Bits[32]
    output wStrb = Bits[4]
    output bHs = Bits[2]
    output bResp = Bits[2]
    output arHs = Bits[2]
    output rHs = Bits[2]
    output rData = Bits[32]
    output rResp = Bits[2]
    output awReady = Bool
    output ok = Bits[2]
    awHs := bus.aw.valid ## bus.aw.ready
    awAddr := bus.aw.payload.addr
    awProt := bus.aw.payload.prot
    wHs := bus.w.valid ## bus.w.ready
    wData := bus.w.payload.data
    wStrb := bus.w.payload.strb
    bHs := bus.b.valid ## bus.b.ready
    bResp := bus.b.payload.resp
    arHs := bus.ar.valid ## bus.ar.ready
    rHs := bus.r.valid ## bus.r.ready
    rData := bus.r.payload.data
    rResp := bus.r.payload.resp
    awReady := bus.aw.ready
    ok := axiRespOkay
}
println("=== 20i: AxiLite4 ===")
println(moduleTreeVL(busAxiLite.create.tree))

module busWb {
    let wb = Wishbone.mk(newBoolNamed("CYC"), newBoolNamed("STB"), newBoolNamed("ACK"),
                         newBoolNamed("WE"), newUIntNamed("ADR", 32), newBitsNamed("DAT_MISO", 32),
                         newBitsNamed("DAT_MOSI", 32), newBitsNamed("SEL", 4))
    let m = wishboneAsMaster(wb)
    // master 视角输出由本模块驱动：恒定单周期读事务（CYC/STB 有效、WE 关断）
    m.CYC := true
    m.STB := true
    m.WE := false
    m.ADR := 0
    m.DAT_MOSI := Bits.mk(None, literal(0))
    m.SEL := Bits.mk(None, literal(0))
    // 从端返回的 ACK / DAT_MISO 被读出 → output 观察口（HDL002）
    output cyc = Bool
    output wbAck = Bool
    output wbRData = Bits[32]
    cyc := m.CYC
    wbAck := m.ACK
    wbRData := m.DAT_MISO
    let av = AvalonST.mk(newBitsNamed("av_data", 8), newBoolNamed("av_valid"), newBoolNamed("av_ready"),
                         newBitsNamed("av_empty", 1), newBoolNamed("av_sop"), newBoolNamed("av_eop"))
    let am = avalonSTAsMaster(av)
    // AvalonST master：恒 valid 的单拍数据流（sop/eop 同拍置位）
    am.data := Bits.mk(None, literal(0))
    am.valid := true
    am.empty := Bits.mk(None, literal(0))
    am.startOfPacket := true
    am.endOfPacket := true
    // 从端反压 av_ready 被读出 → output 观察口（HDL002）
    output avReady = Bool
    output sop = Bool
    avReady := am.ready
    sop := am.startOfPacket
    let st = Axi4Stream.mk(newBitsNamed("s_data", 8), newBitsNamed("s_strb", 1), newBoolNamed("s_last"))
    let sm = axi4StreamAsMaster(st)
    // Axi4Stream master：恒 last 的单拍输出
    sm.data := Bits.mk(None, literal(0))
    sm.strb := Bits.mk(None, literal(0))
    sm.last := false
    output last = Bool
    last := sm.last
}
println("=== 20j: Wishbone / AvalonST / Axi4Stream ===")
println(moduleTreeVL(busWb.create.tree))

module ccBuffer {
    // 异步输入只被同步链读取、从未驱动 → input 端口（HDL001）
    input asyncIn = UInt[8]
    input asyncB = Bool
    // 同步链末端寄存器导出为观察口（读出 _sync 末端寄存器，HDL002）
    output syncedOut = UInt[8]
    output syncBOut = Bool
    let synced = bufferCCUInt2(asyncIn)
    let syncB = bufferCCBool2(asyncB)
    syncedOut := synced
    syncBOut := syncB
}
println("=== 20k: BufferCC ===")
println(moduleTreeVL(ccBuffer.create.tree))

`
          ),
          (e.file_hdl_21_crossclock =
            `

// ============================================================
// HDL Example 21: 真跨时钟域（每寄存器时钟域扩展）
//   PulseCCByToggle / CCByToggle / BufferCC(cd) / StreamFifoCC
// ============================================================

// 两个时钟域：clkA（写域/主时钟）+ clkB（读域）
def inCd: ClockDomain = ClockDomain.mk "clkA" "rstA" Async RisingEdge ActiveHigh
def outCd: ClockDomain = ClockDomain.mk "clkB" "rstB" Async RisingEdge ActiveHigh

module ccPulse[inCd] {
    // 只被逻辑读取、从未驱动 → input 端口（HDL001）
    input pulseIn = Bool
    input data = UInt[8]
    // 只被驱动、模块内无人读取 → output 端口（HDL002）
    output pulseOut = Bool
    output oValid = Bool
    output oData = UInt[8]
    output s2 = UInt[8]
    pulseOut := pulseCCByToggle(pulseIn, inCd, outCd)
    let ccin = CcByToggleIO.mk(Bool.mk(None, literal(1)), data)
    let ccOut = ccByToggleUInt(ccin.valid, ccin.payload, inCd, outCd)
    oValid := ccOut.valid
    oData := ccOut.payload
    let synced = bufferCCUIntCd(data, 2, outCd)
    s2 := synced
}
println("=== 21a: PulseCCByToggle / CCByToggle / BufferCC-cd ===")
println(moduleTreeVL(ccPulse.create[inCd].tree))

module ccFifo[inCd] {
    // 写域（clkA 主时钟）推入，读域（clkB）弹出
    // 推入信号被 FIFO 逻辑读取、从未驱动 → input 端口（HDL001）
    input pushValid = Bool
    input pushData = UInt[8]
    // FIFO 反压/占用数：被 FIFO 驱动、模块内无人读取 → output 端口（HDL002）
    output pushReady = Bool
    output occ = UInt[3]
    // 读域弹出侧观测：只被驱动、无人读取 → output 端口（HDL002）
    output pv = Bool
    output pd = UInt[8]
    let io = StreamFifoCCIO.mk[8, 4](
        pushValid, pushReady,
        pushData,
        newBoolNamed("popValid"), newUIntNamed("popData", 8),
        occ)
    let _d = streamFifoCC[8][4](io, inCd, outCd)
    pv := io.popValid
    pd := io.popData
}
println("=== 21b: StreamFifoCC ===")
println(moduleTreeVL(ccFifo.create[inCd].tree))

`
          ),
          (e.file_hdl_22_widthadapter =
            `

// ============================================================
// HDL Example 22: Vec 硬件索引 + StreamWidthAdapter（字节重排）
//
//   vecAtUInt(vec, sel, default)   Vec 硬件索引 → 平衡 mux 树
//   streamWidth                    2→3 字节收集/重排（寄存器缓冲）
// ============================================================

module vecIndex {
    // Vec 元素与索引只被 mux 树读取、从未驱动 → input 端口（HDL001）
    input a0 = UInt[8]
    input a1 = UInt[8]
    input a2 = UInt[8]
    input a3 = UInt[8]
    input sel = UInt[2]
    let arr = cons a0 (cons a1 (cons a2 (cons a3 nil)))
    let picked = vecAtUInt(arr, sel, UInt.mk(None, literal(0)))
    // out 只被驱动、模块内无人读取 → output 端口（HDL002）
    output out = UInt[8]
    out := picked
}
println("=== 22a: vecAtUInt（Vec 硬件索引平衡 mux 树）===")
println(moduleTreeVL(vecIndex.create.tree))

// StreamWidthAdapter-lite：2 字节输入 → 3 字节输出（字节重排）
// inValid 有效时锁存输入对；cnt 0->1->2 收集 3 字节后 valid 一拍并回绕
module streamWidth {
    // 输入流只被读取（inValid 作锁存使能）、从未驱动 → input 端口（HDL001）
    input inValid = Bool
    input inData0 = UInt[8]
    input inData1 = UInt[8]
    // 输出流只被驱动、模块内无人读取 → output 端口（HDL002）
    output outValid = Bool
    output outData = UInt[24]
    // 字节缓冲寄存器（主时钟）
    reg b0 = UInt[8]
    reg b1 = UInt[8]
    reg b2 = UInt[8]
    reg cnt = UInt[2] init 0
    // inValid 有效时锁存输入对（否则字节缓冲保持）
    when inValid {
        b0 := inData0
        b1 := inData1
        b2 := inData0
    }
    // 拼接输出（b0 b1 b2）
    outData := b0 ## b1 ## b2
    // 满 3 字节后回绕
    outValid := cnt === 2
    when cnt === 2 {
        cnt := 0
    } otherwise {
        cnt := cnt + 1
    }
}
println("=== 22b: StreamWidthAdapter-lite（字节收集 + 重排）===")
println(moduleTreeVL(streamWidth.create.tree))

`
          ),
          (e.file_hdl_23_verilog_compat =
            `

// ============================================================
// HDL Example 23: Verilog 语法兼容层 (Verilog Syntax Compat)
//
//   常用 Verilog 语法可以直接写在 .typort 文件里：module 宏有一条
//   Verilog 臂匹配 \`module top(input clk, ...); <语句> endmodule\`，
//   体内语句经 VExpr 语句表转写为与 typort HDL 完全相同的工厂调用
//   （newUInt / newUIntReg / whenBegin / ...），elaboration、Verilog
//   代码生成、LSP 全部复用。
//
//   - module top(ANSI 端口头); ... endmodule
//   - input clk / reset / rst_n 折叠进时钟域（rst_n → ActiveLow），并生成真实端口
//   - wire/reg [msb:lsb] 声明、assign、if/else、begin/end
//   - always @(posedge clk [or negedge rst_n]) begin q <= d; end
//   - always @(*) 组合块（reg 被组合驱动 → HDV002 提示）
//   - 子模块实例化 add8 u1 (.a(x), .sum(s));（方向自动判定）
//   - 8'hFF / 5'd10 / 4'b1010 sized 字面量、a == b / a != b
//
//   本例是最小骨架（对应 M1）。M2 的位选/部分选、拼接 {a,b}、归约 &|^、
//   case/endcase 见 24-verilog-practice.typort；M3 的显式复位分支与带时钟
//   子模块层次见 25-verilog-reset.typort。仍未支持：parameter 头 / for /
//   initial / generate / $display / 延迟。完整映射表见 docs/verilog-compat.md。
// ============================================================

// ---- 加法器：Verilog 写法 ----
module vAdd8(
    input [7:0] a,
    input [7:0] b,
    output [7:0] s
);
    assign s = a + b;
endmodule

// ---- 加法器：typort 写法（同一语义）----
module tAdd8 {
    input a = UInt[8]
    input b = UInt[8]
    output s = UInt[8]
    s := a + b
}

// ---- 计数器：Verilog 写法（rst_n 折叠为 ActiveLow 复位）----
module vCounter(
    input clk,
    input rst_n,
    input [7:0] d,
    output reg [7:0] q
);
    always @(posedge clk or negedge rst_n) begin
        if (d == 8'hFF)
            q <= 8'h00;
        else
            q <= d + 8'h01;
    end
endmodule

// ---- 计数器：typort 写法 ----
module tCounter {
    input d = UInt[8]
    output reg q = UInt[8] init 0
    when d === 255 {
        q := 0
    } otherwise {
        q := d + 1
    }
}

// ---- 组合逻辑 + 实例化：Verilog 写法 ----
module vSub(
    input [7:0] x,
    output [7:0] y
);
    assign y = ~x;
endmodule
module vTop(
    input [7:0] a,
    output [7:0] b
);
    wire [7:0] w;
    vSub u1 (.x(a), .y(w));
    assign b = w & 8'h0F;
endmodule

println("=== 23a: vAdd8 (Verilog 写法) ===")
println(moduleTreeVL(vAdd8.create.tree))
println("=== 23b: tAdd8 (typort 写法，输出应与 23a 逐字节一致) ===")
println(moduleTreeVL(tAdd8.create.tree))
println("=== 23c: vCounter (negedge rst_n → ActiveLow) ===")
println(moduleTreeVL(vCounter.create.tree))
println("=== 23d: tCounter (typort 写法) ===")
println(moduleTreeVL(tCounter.create.tree))
println("=== 23e: vTop (实例化 .x(a)/.y(w) 方向自动判定) ===")
println(moduleTreeVL(vTop.create.tree))

`
          ),
          (e.file_hdl_24_verilog_practice =
            `

// ============================================================
// HDL Example 24: Verilog 语法实践（M2）
//
//   23-verilog-compat 演示了 M1 的骨架（module 头 / wire / assign /
//   always @(posedge clk) / if / 实例化 / sized 字面量）。本例演示 M2
//   补齐的常用 Verilog 写法：
//
//   - 位选 a[3] 与部分选 a[7:4]（读、写两侧都支持）
//   - 拼接 {a, b}（可嵌套，常量操作数保留自身位宽：{4'h3, b} → {4'd3, b}）
//   - 归约 &a / |a / ^a（结果 Bool，即 1 bit）
//   - case / endcase（default 标签；转写为互斥的 when 链）
//   - always @(*) 组合块（不再多出多余的 clk 端口）
//   - 复位值：模块体内 \`reg q = <init>;\` 与头部的 \`output reg q\`
//     同名时自动去重（端口行声明存储，init 进复位分支）
//   - sized 字面量带位宽输出（8'hFF → 8'd255）
//
//   M2 仍未覆盖：parameter 头、generate、initial、延迟、$display、
//   always 体内手写复位分支（复位值请用 \`reg q = <init>;\` 表达）。
//   完整映射表见 docs/verilog-compat.md。
// ============================================================

// ---- 字节序交换：部分选 + 拼接 ----
module vByteSwap(
    input [15:0] w,
    output [15:0] y
);
    assign y = {w[7:0], w[15:8]};
endmodule

// ---- 归约运算：奇偶 / 全一 / 任意一 ----
module vReduce(
    input [7:0] a,
    output p,
    output allOne,
    output anyOne
);
    assign p = ^a;
    assign allOne = &a;
    assign anyOne = |a;
endmodule

// ---- case/endcase 组合逻辑 ----
module vAlu(
    input [1:0] op,
    input [7:0] a,
    input [7:0] b,
    output reg [7:0] y
);
    always @(*) begin
        case (op)
            2'b00: y = a + b;
            2'b01: y = a & b;
            2'b10: y = {a[3:0], b[3:0]};
            default: y = {7'b0, ^a};
        endcase
    end
endmodule

// ---- 时序：移位寄存器（拼接 + 位选），复位值用 reg init ----
module vShift(
    input clk,
    input [7:0] d,
    output reg [7:0] q
);
    reg [7:0] q = 0;
    always @(posedge clk) begin
        q <= {q[6:0], d[0]};
    end
endmodule

// ---- 层次：实例化组合子模块（方向由 .port(sig) 自动判定）----
module vTop(
    input [15:0] w,
    input [1:0] op,
    input [7:0] a,
    input [7:0] b,
    output [15:0] swapped,
    output [7:0] alu
);
    wire [15:0] sw;
    wire [7:0] al;
    vByteSwap u_swap (.w(w), .y(sw));
    vAlu u_alu (.op(op), .a(a), .b(b), .y(al));
    assign swapped = sw;
    assign alu = al;
endmodule

println("=== 24a: vByteSwap (部分选 + 拼接) ===")
println(moduleTreeVL(vByteSwap.create.tree))
println("=== 24b: vReduce (归约 & | ^) ===")
println(moduleTreeVL(vReduce.create.tree))
println("=== 24c: vAlu (case/endcase, always @(*)) ===")
println(moduleTreeVL(vAlu.create.tree))
println("=== 24d: vShift (时序 + reg init 复位) ===")
println(moduleTreeVL(vShift.create.tree))
println("=== 24e: vTop (实例化组合子模块) ===")
println(moduleTreeVL(vTop.create.tree))

`
          ),
          (e.file_hdl_25_verilog_reset =
            `

// ============================================================
// HDL Example 25: Verilog 复位与时钟层次（M3）
//
//   23/24 演示了 M1/M2 的语法骨架与表达式。本例演示 M3 打通的两件事：
//
//   - 折叠端口成为真实端口：\`input clk\` / \`input reset\` / \`input rst_n\`
//     现在既折叠进 ClockDomain（rst_n → ActiveLow），又生成真实端口，
//     模块体内可以直接引用（此前被静默丢弃）。
//   - always 体内手写复位分支：
//       if (!rst_n) q <= 8'h00; else q <= d;
//     转写为互斥 when 链，复位沿由折叠的复位极性决定。
//   - 带时钟域子模块的实例化：折叠的 clk / rst_n 现在是可连的端口，
//     父模块用 \`.clk(clk)\` / \`.rst_n(rst_n)\` 连接（此前无法连接）。
//
//   复位两种风格都在：
//   - vCntAsync：异步复位（always 敏感表带 negedge rst_n）
//   - vCntSync ：同步复位（只在 posedge clk 内判 rst，端口名非魔法名）
//
//   完整映射表见 docs/verilog-compat.md。
// ============================================================

// ---- 异步复位计数器（显式复位分支）----
module vCntAsync(
    input clk,
    input rst_n,
    input [7:0] d,
    output reg [7:0] q
);
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n)
            q <= 8'h00;
        else
            q <= d + 8'h01;
    end
endmodule

// ---- 同步复位计数器（端口名任意；只在时钟沿内判复位）----
module vCntSync(
    input clk,
    input rst,
    input [7:0] d,
    output reg [7:0] q
);
    always @(posedge clk) begin
        if (rst)
            q <= 8'h00;
        else
            q <= d;
    end
endmodule

// ---- 层次：两级流水线，实例化带时钟域的子模块 ----
module vPipe(
    input clk,
    input rst_n,
    input [7:0] d,
    output [7:0] q
);
    wire [7:0] s1;
    wire [7:0] s2;
    vCntAsync u1 (.clk(clk), .rst_n(rst_n), .d(d), .q(s1));
    vCntAsync u2 (.clk(clk), .rst_n(rst_n), .d(s1), .q(s2));
    assign q = s2;
endmodule

println("=== 25a: vCntAsync (异步复位，显式复位分支) ===")
println(moduleTreeVL(vCntAsync.create.tree))
println("=== 25b: vCntSync (同步复位) ===")
println(moduleTreeVL(vCntSync.create.tree))
println("=== 25c: vPipe (带时钟子模块的层次实例化) ===")
println(moduleTreeVL(vPipe.create.tree))

`
          ),
(e.debuggableFile =
            "# VS Code Mock Debug\n\nThis is a starter sample for developing VS Code debug adapters.\n\n**Mock Debug** simulates a debug adapter for Visual Studio Code.\nIt supports *step*, *continue*, *breakpoints*, *exceptions*, and\n*variable access* but it is not connected to any real debugger.\n\nThe sample is meant as an educational piece showing how to implement a debug\nadapter for VS Code. It can be used as a starting point for developing a real adapter.\n\nMore information about how to develop a new debug adapter can be found\n[here](https://code.visualstudio.com/docs/extensions/example-debuggers).\nOr discuss debug adapters on Gitter:\n[![Gitter Chat](https://img.shields.io/badge/chat-online-brightgreen.svg)](https://gitter.im/Microsoft/vscode)\n\n## Using Mock Debug\n\n* Install the **Mock Debug** extension in VS Code.\n* Create a new 'program' file 'readme.md' and enter several lines of arbitrary text.\n* Switch to the debug viewlet and press the gear dropdown.\n* Select the debug environment \"Mock Debug\".\n* Press the green 'play' button to start debugging.\n\nYou can now 'step through' the 'readme.md' file, set and hit breakpoints, and run into exceptions (if the word exception appears in a line).\n\n![Mock Debug](file.jpg)\n\n## Build and Run\n\n[![build status](https://travis-ci.org/Microsoft/vscode-mock-debug.svg?branch=master)](https://travis-ci.org/Microsoft/vscode-mock-debug)\n[![build status](https://ci.appveyor.com/api/projects/status/empmw5q1tk6h1fly/branch/master?svg=true)](https://ci.appveyor.com/project/weinand/vscode-mock-debug)\n\n\n* Clone the project [https://github.com/Microsoft/vscode-mock-debug.git](https://github.com/Microsoft/vscode-mock-debug.git)\n* Open the project folder in VS Code.\n* Press 'F5' to build and launch Mock Debug in another VS Code window. In that window:\n* Open a new workspace, create a new 'program' file 'readme.md' and enter several lines of arbitrary text.\n* Switch to the debug viewlet and press the gear dropdown.\n* Select the debug environment \"Mock Debug\".\n* Press 'F5' to start debugging."),
          (e.getImageFile = function () {
            const t = atob(
              '/9j/4AAQSkZJRgABAQAASABIAAD/2wCEAA4ODg4ODhcODhchFxcXIS0hISEhLTktLS0tLTlFOTk5OTk5RUVFRUVFRUVSUlJSUlJgYGBgYGxsbGxsbGxsbGwBERISGxkbLxkZL3FMP0xxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcf/AABEIAFYAZAMBIgACEQEDEQH/xAB1AAACAwEBAQAAAAAAAAAAAAAABAMFBgIBBxAAAgIBAwMCBQQCAwAAAAAAAQIAAxEEBSESMUFRcRMiIzJhFIGRoQbBQlKxAQEBAQEAAAAAAAAAAAAAAAABAgADEQEBAQADAQEAAAAAAAAAAAAAARESITECQf/aAAwDAQACEQMRAD8A2LEZkLc/bKxbdYEHWoyfEze56zXpqRTTYUyPHiVrY2TVZyMzhFZMg8iYE6jcVXAusY98KMnj2lhRu+4aLoGuTNTYPV5APnyDNyPFp6EY3EsO3kxnVVLZVg8z2tw9YsXkGQpcbGIbxHQzep0vw8Jgc8n28CJJRY30lBwzf1iaa2ku/HmMV01VW/k/6hh0abTDTafpPcTytmckEewjeosAqJEj0yDo6yO/rFLzoGME5nIAXtGSM9uwnjLn8zFECw7QneITMWouR7gj9/Ep94061bjXa32WDGfzOGuCXKy9/wDc0FlFe5aX4OpHJHBHcSfT4w246bWJar6MsCwKnp9DOF0r6XRiu5snvg9hNK217vQeih0tXwzcED895R7voNfWoN9gOT2QH/2T3mHrda3Y+p9ppZuSV/qR0j6r+5ju2oun2ypOwCAASGikISzdySf5lxLsAdRPpIqw91xC/wDHvGbAAh88RnSVCjT9b8E/MYsguerTqWuYKo8k4ESTcttsPSmoQ+zCZPWPbvWqsvLE0IxCL4wPP7xEW7TXeKsvaGABOMdLef2ky7ejevX0tBWy5Qhh6jmS9IIxPm6XazbW69K56M/aeRibnSaqyytWtGCfE0+tazDhrHpCdixT5EJSWD1BPkcjsYxpN21FWEcdu0dG3hl8rIX0YqUgDqkSrq/0+6oyfOOZT7hqxqLMKMk8ARfS0fqGatAR04yCY+u3OpLt38e0rQl0tzsFrc8rxj0lqqDHMzujIXUMGPI4mjS1MTCvG8gRLddYE2811n5nHTJ9RaAsztzZ1AZhlX9fBi0VWgWzbSqahfpWfa/iSnatMuqOpVgVPIHGMzc6erS3aQVOoZSMFTK19i2pTwGA9Axx/E58b+K2M8lP6/Urp6BkA5Y+OPE112nrIFeOw8RMajQ7dWU0iAH8TyrVG0mw8EypMFuk7K9TS5RGJHiEYsuUtmEWO1KO2RGDRSVJzj1MiQhOQIx8QEYK5hGpUUJVc1lTgcDjEe1FPxqGQHBZSMiQqa8/Z38xgOoHB/aIfJNVZrdFqirsVbsfzLXT7+UQLYmcDHBlh/k+g+KP1dOCV+4efcTNbdtGq3CxQiMKyeX7CGqxqtDuK7lYK2BXnAz3JMuNZoPpDAyV5zHNt2bRbcA1S/Pjljyf7jerWxx0V4wQeZgynxrUXoUnIif629GJY595cptr1N9XJYjOfEi1G3LYMLgH1m04qxelrAtnj/qZYIvUPpMcHwYtTT8FzVaMN6+sslqVF6gcQ1sRivPccwjS314+bGYRBnqzws6FhUfL7CQ8gdI7+TDIHHgcSVGBYRznMXfUL2J5ngPUOYCpfM2tiq1tnUpVRnMe0DGtAKyQIw+mU4GJCKmrPy+I6V0lxYYIzxOCtdjZyVIMRqtPsYx8RT37+sdRhsFlHzcyC0J0kmcfqFX5cxC7VAk4OPUQtM+UVtYf7vH8iKP8SnKg5U9xHQwsGV7jxF9QnWACMEcgwlUjT4ZUE+YRRLGRehwciEpLRMAAT6SALlIQkF4kl7HEIQLwuQfac9RPeEJi5H3TruvvmEJo1QOcgGQuvVg+sITM8rDKeDHVItXkQhKgqM6esnJEIQlJf//Z'
            );
            return Uint8Array.from([...t].map((t) => t.charCodeAt(0)));
          }),
          (e.windows1251File = Uint8Array.from([
            192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205,
            206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219,
            220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233,
            234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247,
            248, 249, 250, 251, 252, 253, 254, 255,
          ])),
          (e.gbkFile = Uint8Array.from([214, 208, 185, 250, 97, 98, 99]));
      },
    ])
  );