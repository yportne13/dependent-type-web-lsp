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
// compositional reasoning with trans, symm, and cong.
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
// 2. n + 1 = succ(n)
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
// 3. double(n) = n + n
//    double is defined as n + n, so this is rfl
// -------------------------------------------------------

def double_eq_add_self(n: Nat): Eq(double(n), n + n) = rfl
println(double_eq_add_self(4))

// -------------------------------------------------------
// 4. Composition: chaining via trans
//    add_zero_right(7): Eq(7+0, 7)
//    symm(add_zero_left(7)): Eq(7, 0+7)
//    Then Eq(7+0, 0+7):
// -------------------------------------------------------

def chain_eg: Eq(7 + 0, 0 + 7) =
    trans(add_zero_right(7), symm(add_zero_left(7)))

println(chain_eg)

// -------------------------------------------------------
// 5. Proof of add_succ_left via induction
//    add_succ_left(n, m): Eq(succ(n) + m, succ(n + m))
//    This is already in the prelude. We just show its usage.
// -------------------------------------------------------

def add_succ_left_eg(n: Nat, m: Nat): Eq(succ(n) + m, succ(n + m)) =
    add_succ_left(n, m)

println(add_succ_left_eg(2, 3))

// -------------------------------------------------------
// 6. add_assoc usage
// -------------------------------------------------------

def assoc_eg: Eq((1 + 2) + 3, 1 + (2 + 3)) = add_assoc(1, 2, 3)
println(assoc_eg)

// -------------------------------------------------------
// 7. trans usage: chaining comm + identity
//    From add_comm(0,5): Eq(0+5, 5+0)
//    From add_zero_right(5): Eq(5+0, 5)
//    trans gives Eq(0+5, 5)
// -------------------------------------------------------

def trans_eg: Eq(0 + 5, 5) = trans(add_comm(0, 5), add_zero_right(5))
println(trans_eg)

// -------------------------------------------------------
// 8. symm usage
//    add_comm(3,2) proves Eq(3+2, 2+3); symm swaps to Eq(2+3, 3+2)
// -------------------------------------------------------

def symm_eg: Eq(2 + 3, 3 + 2) = symm(add_comm(3, 2))
println(symm_eg)

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

// 20c. cong_succ: specialized version of cong for succ
// add_zero_left(5): Eq(0+5, 5)
// cong_succ(add_zero_left(5)): Eq(succ(0+5), succ(5))
def cong_succ_eg: Eq(succ(0 + 5), succ(5)) = cong_succ(add_zero_left(5))
println(cong_succ_eg)

// 20d. add_assoc: (a + b) + c = a + (b + c)
def assoc_eg: Eq((1 + 2) + 3, 1 + (2 + 3)) = add_assoc(1, 2, 3)
println(assoc_eg)

// 20e. symm example with different values
// add_comm(4,1) proves Eq(4+1, 1+4) which is Eq(5, 5); symm to Eq(1+4, 4+1)
def symm_eg2: Eq(1 + 4, 4 + 1) = symm(add_comm(4, 1))
println(symm_eg2)

`
          ),
          (e.file_alu =
            `

// ============================================================
// ALU: Hardware Description DSL Example
// A 4-function ALU using the SpinalHDL-inspired DSL
// ============================================================

// ---------- Simple ALU ----------

module simpleALU {
    input a = UInt[8]
    input b = UInt[8]
    output result = UInt[8]

    // Basic arithmetic
    let sum = UInt[8]
    sum := a + b

    // Bitwise operations
    let and_op = UInt[8]
    and_op := a & b
    let or_op = UInt[8]
    or_op := a | b
    let xor_op = UInt[8]
    xor_op := a ^ b
}

// Print the generated Verilog module
let alu_module_opt = get_global("module").data.head_option
let alu_module = alu_module_opt.unwrap_or(Module.mk("simpleALU", 0, nil))
println(moduleVL(alu_module))

// ---------- Multi-function ALU with selects ----------

module multiALU {
    input op = UInt[2]
    input a = UInt[8]
    input b = UInt[8]
    output result = UInt[8]

    let add = UInt[8]
    add := a + b
    let sub = UInt[8]
    sub := a - b
    let bit_and = UInt[8]
    bit_and := a & b
    let bit_or = UInt[8]
    bit_or := a | b
    let bit_xor = UInt[8]
    bit_xor := a ^ b
}

let multi_module_opt = get_global("module").data.head_option
let multi_module_after = multi_module_opt.unwrap_or(Module.mk("multiALU", 0, nil))

// Delay-check: verify the module name
let multi_module_check = get_global("module")

// Print all accumulated module Verilog
let all_modules = multi_module_check
println("\\n--- ALU Multi-Function Verilog ---")
println(moduleVL(multi_module_after))

`
          ),
          (e.debuggableFile =
            "# VS Code Mock Debug\n\nThis is a starter sample for developing VS Code debug adapters.\n\n**Mock Debug** simulates a debug adapter for Visual Studio Code.\nIt supports *step*, *continue*, *breakpoints*, *exceptions*, and\n*variable access* but it is not connected to any real debugger.\n\nThe sample is meant as an educational piece showing how to implement a debug\nadapter for VS Code. It can be used as a starting point for developing a real adapter.\n\nMore information about how to develop a new debug adapter can be found\n[here](https://code.visualstudio.com/docs/extensions/example-debuggers).\nOr discuss debug adapters on Gitter:\n[![Gitter Chat](https://img.shields.io/badge/chat-online-brightgreen.svg)](https://gitter.im/Microsoft/vscode)\n\n## Using Mock Debug\n\n* Install the **Mock Debug** extension in VS Code.\n* Create a new 'program' file 'readme.md' and enter several lines of arbitrary text.\n* Switch to the debug viewlet and press the gear dropdown.\n* Select the debug environment \"Mock Debug\".\n* Press the green 'play' button to start debugging.\n\nYou can now 'step through' the 'readme.md' file, set and hit breakpoints, and run into exceptions (if the word exception appears in a line).\n\n![Mock Debug](file.jpg)\n\n## Build and Run\n\n[![build status](https://travis-ci.org/Microsoft/vscode-mock-debug.svg?branch=master)](https://travis-ci.org/Microsoft/vscode-mock-debug)\n[![build status](https://ci.appveyor.com/api/projects/status/empmw5q1tk6h1fly/branch/master?svg=true)](https://ci.appveyor.com/project/weinand/vscode-mock-debug)\n\n\n* Clone the project [https://github.com/Microsoft/vscode-mock-debug.git](https://github.com/Microsoft/vscode-mock-debug.git)\n* Open the project folder in VS Code.\n* Press 'F5' to build and launch Mock Debug in another VS Code window. In that window:\n* Open a new workspace, create a new 'program' file 'readme.md' and enter several lines of arbitrary text.\n* Switch to the debug viewlet and press the gear dropdown.\n* Select the debug environment \"Mock Debug\".\n* Press 'F5' to start debugging."),
          (e.getImageFile = function () {
            const t = atob(
              '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'
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