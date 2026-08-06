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
                n.Uri.parse('memfs:/sample-folder/hdl/11-memory.typort'),
                a.encode(s.file_hdl_11_memory),
                { create: !0, overwrite: !0 }
              ),
              this.writeFile(
                n.Uri.parse('memfs:/sample-folder/hdl/12-adder-tree.typort'),
                a.encode(s.file_hdl_12_adder_tree),
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

// ============================================================
// Calc-chain variants.
// Each \`def <name>_calc ... = calc { ... }\` re-proves the same
// proposition as its non-calc original using the calc chain
// syntax \`lhs = rhs by proof\` (see docs/calc-reasoning-design.md).
// The printlns below must print exactly the same values as the
// originals above.
// ============================================================

// 1a-calc: zero_add_comm via a two-step chain
//   0 + n = n     by add_zero_left(n)
//   n     = n + 0 by symm(add_zero_right(n))
def zero_add_comm_calc(n: Nat): Eq(0 + n, n + 0) =
    calc {
        0 + n = n by add_zero_left(n)
        n = n + 0 by symm(add_zero_right(n))
    }

println(zero_add_comm_calc(5))

// 3-calc: add_one_succ via the same two trans steps as the original
//   n + 1       = succ(n + 0) by add_succ_right(n, 0)
//   succ(n + 0) = succ(n)     by cong(succ, add_zero_right(n))
def add_one_succ_calc(n: Nat): Eq(n + 1, succ(n)) =
    calc {
        n + 1 = succ(n + 0) by add_succ_right(n, 0)
        succ(n + 0) = succ(n) by cong(succ, add_zero_right(n))
    }

println(add_one_succ_calc(3))

// 5-calc: chain_eg via a two-step chain
//   7 + 0 = 7     by add_zero_right(7)
//   7     = 0 + 7 by symm(add_zero_left(7))
def chain_eg_calc: Eq(7 + 0, 0 + 7) =
    calc {
        7 + 0 = 7 by add_zero_right(7)
        7 = 0 + 7 by symm(add_zero_left(7))
    }

println(chain_eg_calc)

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
// Re-printing the original here gives the parser its final sync point and
// verifies that the calc variant prints exactly the same value.
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
    let a = UInt[8]
    let bit0 = Bool
    let bit7 = Bool
    bit0 := a.apply[0]
    bit7 := a.apply[7]
}
println("=== Example 1: Bit extraction via apply[N] ===")
println(moduleTreeVL(bitExtract.create.tree))

// ============================================================
// Example 2: Bracket sugar a[N] (desugars to a.apply[N])
// ============================================================
module bracketSugar {
    let a = UInt[8]
    let lsb = Bool
    let msb = Bool
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
    let a = UInt[8]
    let low_nibble = UInt[4]
    let high_nibble = UInt[4]
    low_nibble := a.slice[3, 0]
    high_nibble := a.slice[7, 4]
}
println("=== Example 3: Range extraction via slice[hi, lo] ===")
println(moduleTreeVL(sliceExample.create.tree))

// ============================================================
// Example 4: Bool logic operators (&&, ||, !, ^)
// ============================================================
module boolOps {
    let a = Bool
    let b = Bool
    let and_result = Bool
    let or_result = Bool
    let not_result = Bool
    let xor_result = Bool
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
    let t = UInt[8]
    let x = Bool
    t[0] := x
    t[7] := x
}
println("=== Example 5: LHS bit selection t[N] := x ===")
println(moduleTreeVL(lhsBitsel.create.tree))

// ============================================================
// Example 6: Combining apply, slice, and comparisons
// ============================================================
module comparator {
    let a = UInt[8]
    let b = UInt[8]
    let msb_a = Bool
    let msb_b = Bool
    let eq = Bool
    msb_a := a[7]
    msb_b := b[7]
    eq := a === b
}
println("=== Example 6: Comparator with bit extraction ===")
println(moduleTreeVL(comparator.create.tree))

// ============================================================
// Example 7: Sub-module instantiation
// Define a reusable adder and instantiate it in a top module
// ============================================================
module myAdder[w: Nat] {
    input a = UInt[w]
    input b = UInt[w]
    output sum = UInt[w + 1]
    sum := a +^ b
}

module topWithAdder {
    input a = UInt[8]
    input b = UInt[8]
    let _adder = myAdder.create[8]
    let inst = mkInstance("u_adder", "myAdder")
}
println("=== Example 7: Sub-module instantiation ===")
println(moduleTreeVL(topWithAdder.create.tree))

// ============================================================
// Example 8: Bit concatenation (##) — SpinalHDL style
// ============================================================
module concatExample {
    let a = Bits[4]
    let b = Bits[4]
    let cat_bb = Bits[8]
    let flag = Bool
    let cat_flag = Bits[5]
    let x = UInt[8]
    let y = UInt[8]
    let cat_uu = UInt[16]
    let cat_ub = UInt[12]
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
// 模块可参数化宽度：module name[w: Nat]
// ============================================================

module basicDecls[w: Nat] {
    let a = UInt[w]
    let b = Bits[w]
    let c = SInt[w]
    let d = Bool
    input x = UInt[w]
    output y = UInt[w]
    reg r = UInt[w]
    y := a + x
    r := y
}
println("=== 01a: basicDecls (参数化宽度 + 各类声明) ===")
println(moduleTreeVL(basicDecls.create[8].tree))

module autoNames {
    let mywire = autoUInt(8)
    let myinput = autoUIntInput(8)
    let myreg = autoUIntReg(8)
    let myinit = autoUIntRegInit(8, 5)
    let mybool = autoBool
    let myoutput = autoUIntOutput(8)
    myreg := mywire + myinput
    myoutput := mybool.mux(myreg, myinit)
}
println("=== 01b: autoNames (auto* 自动命名) ===")
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
    let a = UInt[8]
    let b = UInt[8]
    let sum = UInt[8]
    let diff = UInt[8]
    let carry = UInt[9]
    let borrow = UInt[9]
    let prod = UInt[16]
    let add_nat = UInt[8]
    let mul_nat = UInt[8]
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
    let a = SInt[8]
    let b = SInt[8]
    let sum = SInt[8]
    let carry = SInt[9]
    let neg = SInt[8]
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
    let a = Bits[8]
    let b = Bits[8]
    let and_r = Bits[8]
    let or_r = Bits[8]
    let xor_r = Bits[8]
    let not_r = Bits[8]
    let shl = Bits[8]
    let shr = Bits[8]
    let all_ones = Bool
    let any_one = Bool
    let parity = Bool
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
println("=== 03: bitwiseOps (按位 + 移位 + 归约) ===")
println(moduleTreeVL(bitwiseOps.create.tree))

module bitwiseUInt {
    let a = UInt[8]
    let b = UInt[8]
    let and_r = UInt[8]
    let not_r = UInt[8]
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
    let a = UInt[8]
    let b = UInt[8]
    let lt = Bool
    let le = Bool
    let gt = Bool
    let ge = Bool
    let eq = Bool
    let ne = Bool
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
    let a = UInt[8]
    let eq42 = Bool
    let lt100 = Bool
    let ne0 = Bool
    eq42 := a === 42
    lt100 := a < 100
    ne0 := a =/= 0
}
println("=== 04b: compareNat (与 Nat 字面量比较) ===")
println(moduleTreeVL(compareNat.create.tree))

module compareSInt {
    let a = SInt[8]
    let b = SInt[8]
    let lt = Bool
    let eq = Bool
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
    let a = Bool
    let b = Bool
    let and_r = Bool
    let or_r = Bool
    let not_r = Bool
    let xor_r = Bool
    and_r := a && b
    or_r := a || b
    not_r := !a
    xor_r := a ^ b
}
println("=== 05a: boolLogic (&& || ! ^) ===")
println(moduleTreeVL(boolLogic.create.tree))

module boolMux {
    let sel = Bool
    let a = UInt[8]
    let b = UInt[8]
    let out = UInt[8]
    out := sel.mux(a, b)
}
println("=== 05b: boolMux (三目选择) ===")
println(moduleTreeVL(boolMux.create.tree))

module boolTernary {
    let cond = Bool
    let x = UInt[8]
    let y = UInt[8]
    let out = UInt[8]
    out := cond ? x : y
}
println("=== 05c: boolTernary (C 风格三目 ? :) ===")
println(moduleTreeVL(boolTernary.create.tree))

module boolCast {
    let c = Bool
    let b = Bits[1]
    let u = UInt[1]
    let s = SInt[1]
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
    let a = UInt[8]
    let bit0 = Bool
    let bit7 = Bool
    let low4 = UInt[4]
    let hi4 = UInt[4]
    bit0 := a.apply[0]
    bit7 := a[7]
    low4 := a.slice[3, 0]
    hi4 := a.slice[7, 4]
}
println("=== 06a: bitSelect (apply / 方括号 / slice) ===")
println(moduleTreeVL(bitSelect.create.tree))

module lhsBitsel {
    let t = UInt[8]
    let x = Bool
    t[0] := x
    t[7] := x
}
println("=== 06b: lhsBitsel (LHS 位选赋值) ===")
println(moduleTreeVL(lhsBitsel.create.tree))

module concat {
    let a = Bits[4]
    let b = Bits[4]
    let f = Bool
    let x = UInt[8]
    let r_bb = Bits[8]
    let r_bf = Bits[5]
    let r_fb = Bits[5]
    let r_uu = UInt[16]
    let r_xf = UInt[9]
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
//   reg x = UInt[8]         普通寄存器（自动加 clk 端口）
//   reg x = UInt[8] init 42 带异步复位初值（自动加 reset 端口）
//   regNext(value)      延迟一拍（任意 Data，SpinalHDL 风格）
//   regNextWhen(v, cond) 条件延迟
//   when 块内的 :=          条件寄存器赋值
// ============================================================

module regBasic {
    reg r = UInt[8]
    let a = UInt[8]
    r := a
}
println("=== 07a: regBasic (普通寄存器) ===")
println(moduleTreeVL(regBasic.create.tree))

module regInit {
    reg r = UInt[8] init 42
    let a = UInt[8]
    r := a + 1
}
println("=== 07b: regInit (复位初值 42) ===")
println(moduleTreeVL(regInit.create.tree))

module regNextDemo {
    let a = UInt[8]
    let d = regNext(a)
}
println("=== 07c: regNextDemo (延迟一拍) ===")
println(moduleTreeVL(regNextDemo.create.tree))

module regNextAny {
    let a = UInt[8]
    let b = Bits[8]
    let c = Bool
    let e = SInt[4]
    let da = regNext(a)
    let db = regNext(b)
    let dc = regNext(c)
    let de = regNext(e)
}
println("=== 07d: regNextAny (任意 Data 类型) ===")
println(moduleTreeVL(regNextAny.create.tree))

module regNextWhenDemo {
    let a = UInt[8]
    let en = Bool
    let d = regNextWhen(a, en)
}
println("=== 07e: regNextWhenDemo (条件延迟) ===")
println(moduleTreeVL(regNextWhenDemo.create.tree))

module regInWhen {
    reg r = UInt[8]
    let a = UInt[8]
    let en = Bool
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
//
// 注意：when 的 otherwise 分支会作为 if/else 的 else 分支生成
// （when/elsewhen 体在前、otherwise 在后，生成 if ... else if ... else）。
// ============================================================

module whenExample {
    let a = UInt[8]
    let b = UInt[8]
    let sel = Bool
    let out = UInt[8]
    when sel {
        out := a
    } otherwise {
        out := b
    }
}
println("=== 08a: whenExample (when/otherwise) ===")
println(moduleTreeVL(whenExample.create.tree))

module whenElseWhen {
    let a = UInt[8]
    let b = UInt[8]
    let c = UInt[8]
    let sel = UInt[2]
    let out = UInt[8]
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
    let sel = UInt[4]
    let a = UInt[4]
    let b = UInt[4]
    let c = UInt[4]
    let result = UInt[4]
    switch sel {
        is 0 { result := a }
        is 1 { result := b }
        default { result := c }
    }
}
println("=== 08c: switchExample (switch 语句) ===")
println(moduleTreeVL(switchExample.create.tree))

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
// 父模块通过 \`u.port := sig\` 连接，生成器自动聚合到实例行。
// ============================================================

module myAdder[w: Nat]
    input a = UInt[w]
    input b = UInt[w]
    output sum = UInt[w]
    input en = Bool
{
    sum := a + b
}

module topWithAdder {
    input a = UInt[8]
    input b = UInt[8]
    let u = myAdder.create[8]
}
println("=== 09a: topWithAdder (自动实例化) ===")
println(moduleTreeVL(topWithAdder.create.tree))

module topWithPorts {
    input a = UInt[8]
    input b = UInt[8]
    input en = Bool
    let u = myAdder.create[8]
    u.a := a
    u.b := b
    u.en := en
    u.sum := a + b
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
//     3. create_TypeName[bn: BindingName] — 自动命名信号工厂
//        （let 绑定名 + "_" + 字段名，如 master 的 awaddr → "master_awaddr"）
//     4. asMaster / asSlave — 方向化实例方法（SpinalHDL 语义）
//        （字段带 in()/out() 标记时生成：asMaster 把驱动字段做成 output
//        端口、接收字段做成 input 端口，asSlave 反之）
//
//   master := slave  批量赋值（逐字段 assign）
// ============================================================

#[derive(Bundle)]
struct AxiLite {
    awaddr: out(UInt[32])
    awvalid: out(Bool)
    awready: in(Bool)
    wdata: out(UInt[32])
    wvalid: out(Bool)
    wready: in(Bool)
}

module bundleTop {
    let master = create_AxiLite
    let slave = create_AxiLite
    master := slave
}
println("=== 10a: bundleTop (derive(Bundle) 批量赋值) ===")
println(moduleTreeVL(bundleTop.create.tree))

// 参数化 Bundle：宽度来自类型参数
#[derive(Bundle)]
struct MyBus[w: Nat] {
    data: UInt[w]
    valid: Bool
}

module bundleParam {
    let bus1 = create_MyBus[8]
    let bus2 = create_MyBus[8]
    bus1 := bus2
}
println("=== 10b: bundleParam (参数化 Bundle) ===")
println(moduleTreeVL(bundleParam.create.tree))

// master/slave 方向化：同一个 AxiLite，字段方向用 in()/out() 标记
// （master 视角）。create_AxiLite.asMaster 把驱动字段做成 output 端口、
// 接收字段做成 input 端口；asSlave 反之 —— 与 SpinalHDL 的
// AxiLite4().asMaster() / .asSlave() 一致。:= 只驱动可驱动字段（跳过
// input 端口），因此 master/slave 可以双向对连成一个 AXI pass-through。
module bundleMasterSlave {
    let master = create_AxiLite.asMaster
    let slave = create_AxiLite.asSlave
    master := slave
    slave := master
}
println("=== 10c: bundleMasterSlave (master/slave 方向化端口) ===")
println(moduleTreeVL(bundleMasterSlave.create.tree))

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
                    (e.file_hdl_11_memory =
            `

// ============================================================
// HDL Example 11: 内存 (Memory)
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
    let myRam = memUInt(8, 64)
    let addr = UInt[8]
    let d = UInt[8]
    let en = Bool
    myRam.write(addr, d, en)
    let rd = myRam.readSync(addr)
}
println("=== 11a: memWriteRead (同步写 + 同步读) ===")
println(moduleTreeVL(memWriteRead.create.tree))

module memAsyncRead {
    let myRam = memUInt(8, 32)
    let addr = UInt[8]
    let rd = myRam.readAsync(addr)
    let out = UInt[8]
    out := rd
}
println("=== 11b: memAsyncRead (组合读) ===")
println(moduleTreeVL(memAsyncRead.create.tree))

module memMixedTypes {
    let myBits = memBits(4, 16)
    let baddr = UInt[8]
    let bd = Bits[4]
    myBits.write(baddr, bd, Bool.mk(None, literal(1)))
    let brd = myBits.readSync(baddr)

    let myFlag = memBool(16)
    let faddr = UInt[8]
    let fd = Bool
    let fen = Bool
    myFlag.write(faddr, fd, fen)
    let frd = myFlag.readSync(faddr)
}
println("=== 11c: memMixedTypes (Bits/Bool 内存) ===")
println(moduleTreeVL(memMixedTypes.create.tree))

module memReadInWhen {
    let myRam = memUInt(8, 16)
    let addr = UInt[8]
    let d = UInt[8]
    let en = Bool
    when en {
        myRam.write(addr, d, en)
    }
}
println("=== 11d: memReadInWhen (when 内写内存) ===")
println(moduleTreeVL(memReadInWhen.create.tree))

`
          ),
          (e.file_hdl_12_adder_tree =
            `

// ============================================================
// HDL Example 12: 加法树 (Adder Tree) — 位宽随深度增长
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
    let a0 = UInt[8]
    let a1 = UInt[8]
    let a2 = UInt[8]
    let a3 = UInt[8]
    let a4 = UInt[8]
    let a5 = UInt[8]
    let a6 = UInt[8]
    let a7 = UInt[8]
    let sum = UInt[11]
    sum := adder_tree (a0 :: a1 :: a2 :: a3 :: a4 :: a5 :: a6 :: a7 :: nil)
}
println("=== 12a: adderTree8 (8 x UInt[8] -> UInt[11]) ===")
println(moduleTreeVL(adderTree8.create.tree))

// 4 个 UInt[16] 输入 → UInt[16 + log2Up 4] = UInt[18]
module adderTree4 {
    let b0 = UInt[16]
    let b1 = UInt[16]
    let b2 = UInt[16]
    let b3 = UInt[16]
    let sum = UInt[18]
    sum := adder_tree (b0 :: b1 :: b2 :: b3 :: nil)
}
println("=== 12b: adderTree4 (4 x UInt[16] -> UInt[18]) ===")
println(moduleTreeVL(adderTree4.create.tree))

// 3 个 UInt[8] 输入（奇数个，触发 widenOne 路径）→ UInt[8 + log2Up 3] = UInt[10]
module adderTree3 {
    let c0 = UInt[8]
    let c1 = UInt[8]
    let c2 = UInt[8]
    let sum = UInt[10]
    sum := adder_tree (c0 :: c1 :: c2 :: nil)
}
println("=== 12c: adderTree3 (3 x UInt[8] -> UInt[10], 奇数个元素) ===")
println(moduleTreeVL(adderTree3.create.tree))

// 运行时验证：log2Up 求值
println(8 + (log2Up 8))
println(16 + (log2Up 4))
println(8 + (log2Up 3))

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