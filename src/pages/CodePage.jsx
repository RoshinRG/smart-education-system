import React, { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";

const LANGUAGES = [
  { id: "python",      label: "Python",      monaco: "python",     version: "3.10.0",  icon: "🐍", color: "#3b82f6", starter: "# Python\nprint(\"Hello, World!\")\n\nname = input(\"Enter your name: \")\nprint(f\"Welcome, {name}!\")\n\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a, end=\" \")\n        a, b = b, a + b\nprint(\"\\nFibonacci:\")\nfib(10)\n" },
  { id: "javascript",  label: "JavaScript",  monaco: "javascript", version: "18.15.0", icon: "🟡", color: "#f59e0b", starter: "// JavaScript\nconsole.log(\"Hello, World!\");\nconst nums = [1,2,3,4,5];\nconsole.log(\"Squares:\", nums.map(n => n**2));\n" },
  { id: "typescript",  label: "TypeScript",  monaco: "typescript", version: "5.0.3",   icon: "🔷", color: "#3b82f6", starter: "// TypeScript\ninterface Student { name: string; grade: number; }\nfunction getStatus(s: Student): string {\n  return s.grade >= 90 ? \"Excellent\" : s.grade >= 75 ? \"Good\" : \"Average\";\n}\nconst s: Student = { name: \"Alice\", grade: 92 };\nconsole.log(`${s.name}: ${getStatus(s)}`);\n" },
  { id: "java",        label: "Java",        monaco: "java",       version: "15.0.2",  icon: "☕", color: "#f97316", starter: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n    int[] arr = {64,34,25,12,22,11,90};\n    for (int i=0;i<arr.length-1;i++)\n      for (int j=0;j<arr.length-i-1;j++)\n        if (arr[j]>arr[j+1]) { int t=arr[j];arr[j]=arr[j+1];arr[j+1]=t; }\n    System.out.print(\"Sorted: \");\n    for (int x:arr) System.out.print(x+\" \");\n  }\n}\n" },
  { id: "c",           label: "C",           monaco: "c",          version: "10.2.0",  icon: "⚙️", color: "#6366f1", starter: "#include <stdio.h>\nint factorial(int n) { return n<=1?1:n*factorial(n-1); }\nint main() {\n  printf(\"Hello, World!\\n\");\n  for(int i=1;i<=10;i++) printf(\"%d! = %d\\n\",i,factorial(i));\n  return 0;\n}\n" },
  { id: "cpp",         label: "C++",         monaco: "cpp",        version: "10.2.0",  icon: "⚡", color: "#a855f7", starter: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n  cout<<\"Hello, World!\"<<endl;\n  vector<int> v={5,2,8,1,9,3};\n  sort(v.begin(),v.end());\n  for(int x:v) cout<<x<<\" \";\n  cout<<endl;\n}\n" },
  { id: "csharp",      label: "C#",          monaco: "csharp",     version: "6.12.0",  icon: "🟣", color: "#8b5cf6", starter: "using System;\nusing System.Linq;\nclass Program {\n  static void Main() {\n    Console.WriteLine(\"Hello, World!\");\n    int[] nums={3,1,4,1,5,9,2,6};\n    Console.WriteLine(string.Join(\", \",nums.OrderBy(x=>x)));\n  }\n}\n" },
  { id: "go",          label: "Go",          monaco: "go",         version: "1.16.2",  icon: "🐹", color: "#06b6d4", starter: "package main\nimport \"fmt\"\nfunc main() {\n  fmt.Println(\"Hello, World!\")\n  fibs := []int{0,1}\n  for i:=2;i<10;i++ { fibs=append(fibs,fibs[i-1]+fibs[i-2]) }\n  fmt.Println(\"Fibonacci:\",fibs)\n}\n" },
  { id: "rust",        label: "Rust",        monaco: "rust",       version: "1.50.0",  icon: "🦀", color: "#f97316", starter: "fn main() {\n  println!(\"Hello, World!\");\n  let v: Vec<i32> = (1..=5).collect();\n  v.iter().for_each(|x| print!(\"{} \", x*x));\n  println!();\n  let grade = 85;\n  let status = match grade { 90..=100=>\"Excellent\", 75..=89=>\"Good\", _=>\"Average\" };\n  println!(\"Grade {}: {}\", grade, status);\n}\n" },
  { id: "ruby",        label: "Ruby",        monaco: "ruby",       version: "3.0.1",   icon: "💎", color: "#ef4444", starter: "puts \"Hello, World!\"\n(1..5).each { |n| puts \"#{n}^2 = #{n**2}\" }\nclass Student\n  attr_reader :name, :grade\n  def initialize(n,g) = @name,@grade=n,g\n  def status = grade>=90 ? \"Excellent\" : \"Good\"\nend\ns = Student.new(\"Alice\", 95)\nputs \"#{s.name}: #{s.status}\"\n" },
  { id: "php",         label: "PHP",         monaco: "php",        version: "8.2.3",   icon: "🐘", color: "#7c3aed", starter: "<?php\necho \"Hello, World!\\n\";\n$nums = range(1,5);\nforeach($nums as $n) echo \"$n squared = \".($n*$n).\"\\n\";\nfunction isPrime($n){if($n<2)return false;for($i=2;$i<=sqrt($n);$i++)if($n%$i===0)return false;return true;}\necho implode(' ',array_filter(range(2,20),'isPrime')).\"\\n\";\n" },
  { id: "swift",       label: "Swift",       monaco: "swift",      version: "5.3.3",   icon: "🦅", color: "#f97316", starter: "print(\"Hello, World!\")\nlet nums = [1,2,3,4,5]\nlet sq = nums.map { $0*$0 }\nprint(\"Squares:\", sq)\nlet grade = 85\nlet s = grade>=90 ? \"Excellent\" : grade>=75 ? \"Good\" : \"Average\"\nprint(\"Grade \\(grade): \\(s)\")\n" },
  { id: "kotlin",      label: "Kotlin",      monaco: "kotlin",     version: "1.8.20",  icon: "🎯", color: "#a855f7", starter: "fun main() {\n  println(\"Hello, World!\")\n  val evens = (1..10).filter { it%2==0 }\n  println(\"Evens: $evens\")\n  data class Student(val name:String, val grade:Int)\n  val s = Student(\"Alice\",92)\n  println(\"${s.name}: ${s.grade}\")\n}\n" },
  { id: "r",           label: "R",           monaco: "r",          version: "4.1.1",   icon: "📊", color: "#2563eb", starter: "cat(\"Hello, World!\\n\")\nscores <- c(72,85,90,65,88,95,78)\ncat(\"Mean:\",mean(scores),\"\\n\")\ncat(\"SD:  \",round(sd(scores),2),\"\\n\")\ncat(\"Max: \",max(scores),\"\\n\")\n" },
  { id: "bash",        label: "Bash",        monaco: "shell",      version: "5.2.0",   icon: "💻", color: "#10b981", starter: "#!/bin/bash\necho \"Hello, World!\"\nfor i in {1..5}; do echo \"Count: $i\"; done\ngreet() { echo \"Welcome, $1!\"; }\ngreet \"Student\"\necho \"2^10 = $((2**10))\"\n" },
  { id: "lua",         label: "Lua",         monaco: "lua",        version: "5.4.4",   icon: "🌙", color: "#6366f1", starter: "print(\"Hello, World!\")\nlocal fruits={\"Apple\",\"Banana\",\"Cherry\"}\nfor i,v in ipairs(fruits) do print(i,v) end\nlocal function factorial(n) if n<=1 then return 1 end return n*factorial(n-1) end\nprint(\"10! =\", factorial(10))\n" },
  { id: "scala",       label: "Scala",       monaco: "scala",      version: "3.2.2",   icon: "🔴", color: "#dc2626", starter: "@main def hello() =\n  println(\"Hello, World!\")\n  val nums = (1 to 10).toList\n  println(s\"Evens: ${nums.filter(_%2==0)}\")\n  case class Student(name: String, grade: Int)\n  val s = Student(\"Alice\",92)\n  println(s\"${s.name}: ${s.grade}\")\n" },
  { id: "perl",        label: "Perl",        monaco: "perl",       version: "5.36.0",  icon: "🐪", color: "#0891b2", starter: "#!/usr/bin/perl\nuse strict; use warnings;\nprint \"Hello, World!\\n\";\nmy @sq = map { $_**2 } 1..5;\nprint \"Squares: @sq\\n\";\n" },
  { id: "haskell",     label: "Haskell",     monaco: "haskell",    version: "9.0.2",   icon: "🎩", color: "#7c3aed", starter: "main :: IO ()\nmain = do\n  putStrLn \"Hello, World!\"\n  let fibs = 0:1:zipWith (+) fibs (tail fibs)\n  print $ take 10 fibs\n  let isPrime n = n>1 && all (\\x->n`mod`x/=0) [2..floor(sqrt(fromIntegral n))]\n  print $ filter isPrime [2..30]\n" },
  { id: "elixir",      label: "Elixir",      monaco: "elixir",     version: "1.14.0",  icon: "💜", color: "#7c3aed", starter: "IO.puts(\"Hello, World!\")\nsquares = for n <- 1..5, do: n*n\nIO.inspect(squares, label: \"Squares\")\ndefmodule Grade do\n  def status(s) when s>=90, do: \"Excellent\"\n  def status(s) when s>=75, do: \"Good\"\n  def status(_), do: \"Average\"\nend\nIO.puts(\"Score 88: #{Grade.status(88)}\")\n" },
  { id: "dart",        label: "Dart",        monaco: "dart",       version: "2.19.6",  icon: "🎯", color: "#06b6d4", starter: "void main() {\n  print('Hello, World!');\n  var nums = List.generate(5,(i)=>i+1);\n  print('Squares: ${nums.map((n)=>n*n).toList()}');\n}\n" },
  { id: "sqlite3",     label: "SQL",         monaco: "sql",        version: "3.36.0",  icon: "🗃️", color: "#0891b2", starter: "CREATE TABLE students(id INTEGER PRIMARY KEY, name TEXT, grade INTEGER);\nINSERT INTO students VALUES(1,'Alice',92),(2,'Bob',78),(3,'Charlie',88);\nSELECT name,grade, CASE WHEN grade>=90 THEN 'Excellent' WHEN grade>=75 THEN 'Good' ELSE 'Average' END AS status FROM students ORDER BY grade DESC;\n" },
];

const THEMES=[{id:"vs-dark",label:"🌑 Dark",monacoTheme:"vs-dark"},{id:"light",label:"☀️ Light",monacoTheme:"light"},{id:"hc-black",label:"⚫ HC Dark",monacoTheme:"hc-black"}];
const FONT_SIZES=[12,13,14,15,16,18,20];

async function runCode(language,code,stdin){
  const lang=LANGUAGES.find(l=>l.id===language);
  if(!lang) throw new Error("Unknown language");
  const res=await fetch("https://emkc.org/api/v2/piston/execute",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({language:lang.id,version:lang.version,files:[{name:"main",content:code}],stdin:stdin||""}),
  });
  if(!res.ok) throw new Error(`Piston API error ${res.status}: ${res.statusText}`);
  return res.json();
}

export default function CodePage(){
  const [langId,setLangId]=useState("python");
  const [code,setCode]=useState(LANGUAGES[0].starter);
  const [stdin,setStdin]=useState("");
  const [output,setOutput]=useState(null);
  const [running,setRunning]=useState(false);
  const [theme,setTheme]=useState("vs-dark");
  const [fontSize,setFontSize]=useState(14);
  const [showLangMenu,setShowLangMenu]=useState(false);
  const [showStdin,setShowStdin]=useState(false);
  const [editorReady,setEditorReady]=useState(false);
  const [runTime,setRunTime]=useState(null);
  const [langSearch,setLangSearch]=useState("");
  const outputRef=useRef(null);
  const langMenuRef=useRef(null);

  const currentLang=LANGUAGES.find(l=>l.id===langId)||LANGUAGES[0];
  const filteredLangs=LANGUAGES.filter(l=>l.label.toLowerCase().includes(langSearch.toLowerCase()));

  useEffect(()=>{
    const handler=(e)=>{ if(langMenuRef.current&&!langMenuRef.current.contains(e.target)) setShowLangMenu(false); };
    document.addEventListener("mousedown",handler);
    return ()=>document.removeEventListener("mousedown",handler);
  },[]);

  const handleRun=useCallback(async()=>{
    if(running) return;
    setRunning(true); setOutput(null); setRunTime(null);
    const start=Date.now();
    try{
      const result=await runCode(langId,code,stdin);
      setRunTime(Date.now()-start);
      setOutput(result);
      setTimeout(()=>outputRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}),100);
    }catch(err){
      setOutput({error:err.message});
    }finally{
      setRunning(false);
    }
  },[running,langId,code,stdin]);

  useEffect(()=>{
    const h=(e)=>{ if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();handleRun();} };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[handleRun]);

  const selectLang=(id)=>{
    setLangId(id);
    setCode(LANGUAGES.find(l=>l.id===id).starter);
    setOutput(null); setRunTime(null); setShowLangMenu(false); setLangSearch("");
  };

  const stdout=output?.run?.output||"";
  const compileErr=output?.compile?.stderr||output?.compile?.output||"";
  const runtimeErr=output?.run?.stderr||"";
  const apiErr=output?.error||"";
  const hasError=!!(compileErr||runtimeErr||apiErr);
  const exitCode=output?.run?.code??null;
  const monacoTheme=THEMES.find(t=>t.id===theme)?.monacoTheme||"vs-dark";

  return(
    <div id="code-page" className="code-page-root">
      {/* Header */}
      <div className="code-page-header">
        <div className="code-page-title">
          <span style={{fontSize:"1.6rem"}}>⌨️</span>
          <div>
            <div style={{fontWeight:700,fontSize:"1.1rem",color:"#fff"}}>Code IDE</div>
            <div style={{fontSize:"0.7rem",color:"#64748b"}}>Piston API · {LANGUAGES.length} Languages · Runs in cloud sandbox</div>
          </div>
        </div>
        <div className="code-page-controls">
          {/* Language picker */}
          <div ref={langMenuRef} style={{position:"relative"}}>
            <button id="lang-picker-btn" className="code-ctrl-btn" onClick={()=>setShowLangMenu(v=>!v)} style={{borderColor:currentLang.color+"55"}}>
              <span>{currentLang.icon}</span>
              <span style={{fontWeight:600,color:currentLang.color}}>{currentLang.label}</span>
              <span style={{fontSize:"0.7rem",opacity:0.5}}>▾</span>
            </button>
            {showLangMenu&&(
              <div className="code-lang-dropdown">
                <div style={{padding:"8px"}}>
                  <input autoFocus type="text" placeholder="Search language…" value={langSearch} onChange={e=>setLangSearch(e.target.value)} className="code-lang-search"/>
                </div>
                <div className="code-lang-list">
                  {filteredLangs.map(l=>(
                    <button key={l.id} className={`code-lang-item${l.id===langId?" active":""}`} onClick={()=>selectLang(l.id)} style={{"--lang-color":l.color}}>
                      <span>{l.icon}</span><span>{l.label}</span>
                      {l.id===langId&&<span style={{marginLeft:"auto",color:"#22c55e"}}>✓</span>}
                    </button>
                  ))}
                  {filteredLangs.length===0&&<div style={{padding:"16px",color:"#64748b",textAlign:"center"}}>No results</div>}
                </div>
              </div>
            )}
          </div>
          <select id="theme-select" value={theme} onChange={e=>setTheme(e.target.value)} className="code-ctrl-select">
            {THEMES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <select id="font-size-select" value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} className="code-ctrl-select">
            {FONT_SIZES.map(s=><option key={s} value={s}>{s}px</option>)}
          </select>
          <button id="download-btn" className="code-ctrl-btn" title="Download code" onClick={()=>{
            const ext={python:"py",javascript:"js",typescript:"ts",java:"java",c:"c",cpp:"cpp",csharp:"cs",go:"go",rust:"rs",ruby:"rb",php:"php",swift:"swift",kotlin:"kt",r:"r",bash:"sh",lua:"lua",scala:"scala",perl:"pl",haskell:"hs",elixir:"ex",dart:"dart",sqlite3:"sql"};
            const a=document.createElement("a");
            a.href=URL.createObjectURL(new Blob([code],{type:"text/plain"}));
            a.download=`main.${ext[langId]||"txt"}`; a.click();
          }}>⬇ Download</button>
          <button id="stdin-toggle-btn" className={`code-ctrl-btn${showStdin?" active":""}`} onClick={()=>setShowStdin(v=>!v)}>📥 Stdin</button>
          <button id="run-code-btn" className={`code-run-btn${running?" running":""}`} onClick={handleRun} disabled={running}>
            {running?<><span className="code-spinner"/>Running…</>:<>▶&nbsp;Run</>}
          </button>
        </div>
      </div>

      {/* Main split */}
      <div className="code-page-body">
        {/* Editor panel */}
        <div className="code-editor-panel">
          <div className="code-editor-toolbar">
            <div style={{display:"flex",gap:"5px",alignItems:"center"}}>
              <span className="code-dot red"/><span className="code-dot yellow"/><span className="code-dot green"/>
            </div>
            <span style={{fontSize:"0.75rem",color:"#475569",fontFamily:"monospace",marginLeft:"8px"}}>
              {["javascript","typescript","csharp","sqlite3"].includes(langId)
                ?{javascript:"main.js",typescript:"main.ts",csharp:"Main.cs",sqlite3:"query.sql"}[langId]
                :`main.${langId}`}
            </span>
            {editorReady&&<span style={{marginLeft:"auto",fontSize:"0.65rem",color:"#22c55e",fontWeight:600}}>● Ready</span>}
            <button className="code-ctrl-btn small" style={{marginLeft:editorReady?"8px":"auto"}} onClick={()=>setCode(currentLang.starter)} title="Reset to starter">↺ Reset</button>
            <button className="code-ctrl-btn small" onClick={()=>navigator.clipboard.writeText(code)} title="Copy code">⎘ Copy</button>
          </div>
          <div className="code-monaco-wrapper">
            <Editor
              language={currentLang.monaco}
              theme={monacoTheme}
              value={code}
              onChange={v=>setCode(v||"")}
              onMount={(_e)=>{setEditorReady(true);}}
              options={{
                fontSize,
                fontFamily:"'JetBrains Mono','Fira Code',Consolas,monospace",
                fontLigatures:true,
                minimap:{enabled:false},
                scrollBeyondLastLine:false,
                wordWrap:"on",
                automaticLayout:true,
                tabSize:2,
                renderLineHighlight:"all",
                cursorBlinking:"smooth",
                cursorSmoothCaretAnimation:"on",
                smoothScrolling:true,
                padding:{top:16,bottom:16},
                glyphMargin:false,
                folding:true,
                bracketPairColorization:{enabled:true},
                quickSuggestions:true,
              }}
              loading={<div className="code-editor-loading"><div className="code-spinner large"/><span style={{color:"#64748b",marginTop:"8px"}}>Loading Monaco Editor…</span></div>}
            />
          </div>
          {showStdin&&(
            <div className="code-stdin-panel">
              <div style={{fontSize:"0.75rem",color:"#64748b",marginBottom:"6px",fontWeight:600}}>📥 Standard Input (stdin)</div>
              <textarea id="stdin-textarea" value={stdin} onChange={e=>setStdin(e.target.value)} placeholder="Type program input here (one value per line)…" className="code-stdin-textarea" rows={3}/>
            </div>
          )}
        </div>

        {/* Console panel */}
        <div ref={outputRef} className="code-console-panel">
          <div className="code-console-header">
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
              <span>🖥️</span>
              <span style={{fontWeight:700,fontSize:"0.875rem"}}>Console</span>
              {output&&<span className={`code-exit-badge${hasError?" error":" success"}`}>{hasError?"✗ Error":`✓ Exit ${exitCode??0}`}</span>}
              {runTime&&<span style={{fontSize:"0.7rem",color:"#64748b"}}>{runTime}ms</span>}
            </div>
            {output&&(
              <div style={{display:"flex",gap:"6px"}}>
                <button id="copy-output-btn" className="code-ctrl-btn small" onClick={()=>navigator.clipboard.writeText(stdout||compileErr||runtimeErr||apiErr)}>⎘ Copy</button>
                <button id="clear-output-btn" className="code-ctrl-btn small" onClick={()=>{setOutput(null);setRunTime(null);}}>✕ Clear</button>
              </div>
            )}
          </div>
          <div className="code-console-body">
            {!output&&!running&&(
              <div className="code-console-empty">
                <div style={{fontSize:"3.5rem",opacity:0.15,lineHeight:1}}>▶</div>
                <div style={{color:"#475569",fontSize:"0.9rem",marginTop:"12px"}}>
                  Press <kbd className="code-kbd">Ctrl</kbd>+<kbd className="code-kbd">Enter</kbd> or click <strong>Run</strong>
                </div>
                <div style={{color:"#334155",fontSize:"0.75rem",marginTop:"6px"}}>Your code runs securely on cloud servers</div>
              </div>
            )}
            {running&&(
              <div className="code-console-empty">
                <div className="code-spinner large"/>
                <div style={{color:"#64748b",fontSize:"0.9rem",marginTop:"16px"}}>
                  Executing <strong style={{color:currentLang.color}}>{currentLang.label}</strong>…
                </div>
              </div>
            )}
            {output&&(
              <div style={{fontFamily:"'JetBrains Mono','Fira Code',Consolas,monospace",fontSize:"0.82rem"}}>
                {compileErr&&(
                  <div className="code-output-section">
                    <div className="code-output-label error">⚠ Compile Error</div>
                    <pre className="code-output-pre error">{compileErr}</pre>
                  </div>
                )}
                {stdout&&(
                  <div className="code-output-section">
                    <div className="code-output-label success">✓ stdout</div>
                    <pre className="code-output-pre success">{stdout}</pre>
                  </div>
                )}
                {runtimeErr&&(
                  <div className="code-output-section">
                    <div className="code-output-label error">✗ stderr</div>
                    <pre className="code-output-pre error">{runtimeErr}</pre>
                  </div>
                )}
                {apiErr&&(
                  <div className="code-output-section">
                    <div className="code-output-label error">✗ Network Error</div>
                    <pre className="code-output-pre error">{apiErr}</pre>
                  </div>
                )}
                {!stdout&&!compileErr&&!runtimeErr&&!apiErr&&(
                  <div style={{color:"#64748b",fontStyle:"italic",padding:"12px 0"}}>(no output)</div>
                )}
              </div>
            )}
          </div>
          <div className="code-console-footer">
            <span>⌨️ <kbd className="code-kbd">Ctrl+Enter</kbd> to run</span>
            <span style={{color:"#334155"}}>·</span>
            <span>🌐 Powered by Piston API</span>
            <span style={{color:"#334155"}}>·</span>
            <span>🔒 Sandboxed execution</span>
          </div>
        </div>
      </div>

      {/* Language chip bar */}
      <div className="code-info-bar">
        {LANGUAGES.map(l=>(
          <button key={l.id} className={`code-info-lang-chip${l.id===langId?" active":""}`}
            onClick={()=>selectLang(l.id)} style={{"--lang-color":l.color}} title={l.label}>
            {l.icon} {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
