// Comprehensive programming languages catalogue for Smart Education Code IDE
// 95+ languages across 17 categories

export const CATEGORIES = [
  "All",
  "Mainstream",
  "Functional",
  "Systems",
  "Scripting",
  "Web",
  "Data & Science",
  "Query & DB",
  "Mobile",
  "Older & Legacy",
  "JVM",
  ".NET",
  "Hardware (HDL)",
  "Config & Markup",
  "Esoteric",
  "Game Dev",
  "Other Notable",
];

export const LANGUAGES = [
  // ==========================================
  // 1. MAINSTREAM GENERAL-PURPOSE
  // ==========================================
  {
    id: "python",
    label: "Python",
    categories: ["Mainstream", "Data & Science", "Scripting"],
    icon: "🐍",
    color: "#3b82f6",
    monaco: "python",
    ext: "py",
    piston: { language: "python", version: "3.10.0" },
    starter: `# Python 3
print("Hello, World!")

def fibonacci(n):
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

print("First 10 Fibonacci numbers:", fibonacci(10))

squares = {x: x**2 for x in range(1, 6)}
print("Squares dict:", squares)
`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    categories: ["Mainstream", "Web", "Scripting"],
    icon: "🟡",
    color: "#f59e0b",
    monaco: "javascript",
    ext: "js",
    piston: { language: "javascript", version: "18.15.0" },
    starter: `// JavaScript (Node.js)
console.log("Hello, World!");

const students = [
  { name: "Alice", score: 95 },
  { name: "Bob", score: 78 },
  { name: "Charlie", score: 88 }
];

const topStudents = students
  .filter(s => s.score >= 80)
  .map(s => \`\${s.name} (\${s.score}%)\`);

console.log("High Achievers:", topStudents.join(", "));
`,
  },
  {
    id: "typescript",
    label: "TypeScript",
    categories: ["Mainstream", "Web"],
    icon: "🔷",
    color: "#3b82f6",
    monaco: "typescript",
    ext: "ts",
    piston: { language: "typescript", version: "5.0.3" },
    starter: `// TypeScript
interface Student {
  readonly id: number;
  name: string;
  grades: number[];
}

function calculateAverage(s: Student): number {
  const sum = s.grades.reduce((a, b) => a + b, 0);
  return Number((sum / s.grades.length).toFixed(1));
}

const alice: Student = { id: 101, name: "Alice", grades: [92, 88, 96, 90] };
console.log(\`\${alice.name} - Average Grade: \${calculateAverage(alice)}\`);
`,
  },
  {
    id: "java",
    label: "Java",
    categories: ["Mainstream", "JVM", "Mobile"],
    icon: "☕",
    color: "#f97316",
    monaco: "java",
    ext: "java",
    piston: { language: "java", version: "15.0.2" },
    starter: `// Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        List<String> items = Arrays.asList("Java", "Kotlin", "Scala", "Clojure");
        items.stream()
             .map(String::toUpperCase)
             .forEach(s -> System.out.println("  • " + s));
    }
}
`,
  },
  {
    id: "c",
    label: "C",
    categories: ["Mainstream", "Systems"],
    icon: "⚙️",
    color: "#6366f1",
    monaco: "c",
    ext: "c",
    piston: { language: "c", version: "10.2.0" },
    starter: `// C (C11)
#include <stdio.h>

long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    printf("Hello, World!\\n");
    for (int i = 1; i <= 8; i++) {
        printf("%d! = %lld\\n", i, factorial(i));
    }
    return 0;
}
`,
  },
  {
    id: "cpp",
    label: "C++",
    categories: ["Mainstream", "Systems", "Game Dev"],
    icon: "⚡",
    color: "#a855f7",
    monaco: "cpp",
    ext: "cpp",
    piston: { language: "c++", version: "10.2.0" },
    starter: `// C++ (C++20)
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::cout << "Hello, World!" << std::endl;
    std::vector<int> nums = {64, 34, 25, 12, 22, 11, 90};
    std::sort(nums.begin(), nums.end());
    
    std::cout << "Sorted: ";
    for (int n : nums) std::cout << n << " ";
    std::cout << "\\nSum: " << std::accumulate(nums.begin(), nums.end(), 0) << std::endl;
    return 0;
}
`,
  },
  {
    id: "csharp",
    label: "C#",
    categories: ["Mainstream", ".NET", "Game Dev"],
    icon: "🟣",
    color: "#8b5cf6",
    monaco: "csharp",
    ext: "cs",
    piston: { language: "csharp", version: "6.12.0" },
    starter: `// C#
using System;
using System.Linq;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
        var numbers = Enumerable.Range(1, 10).Where(n => n % 2 == 0);
        Console.WriteLine("Even numbers: " + string.Join(", ", numbers));
        
        var (name, score) = ("Roshin", 98);
        Console.WriteLine($"Student: {name}, Grade: {score}");
    }
}
`,
  },
  {
    id: "go",
    label: "Go",
    categories: ["Mainstream", "Systems"],
    icon: "🐹",
    color: "#06b6d4",
    monaco: "go",
    ext: "go",
    piston: { language: "go", version: "1.16.2" },
    starter: `// Go
package main

import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println("Hello, World from Go!")
	langs := []string{"Go", "Rust", "TypeScript", "Python"}
	for i, lang := range langs {
		fmt.Printf("%d. %s (upper: %s)\\n", i+1, lang, strings.ToUpper(lang))
	}
}
`,
  },
  {
    id: "rust",
    label: "Rust",
    categories: ["Mainstream", "Systems"],
    icon: "🦀",
    color: "#f97316",
    monaco: "rust",
    ext: "rs",
    piston: { language: "rust", version: "1.68.2" },
    starter: `// Rust
fn main() {
    println!("Hello, World!");
    let primes: Vec<u32> = (2..50).filter(|&n| is_prime(n)).collect();
    println!("Primes up to 50: {:?}", primes);
}

fn is_prime(n: u32) -> bool {
    if n < 2 { return false; }
    for i in 2..=((n as f64).sqrt() as u32) {
        if n % i == 0 { return false; }
    }
    true
}
`,
  },
  {
    id: "kotlin",
    label: "Kotlin",
    categories: ["Mainstream", "JVM", "Mobile"],
    icon: "🎯",
    color: "#a855f7",
    monaco: "kotlin",
    ext: "kt",
    piston: { language: "kotlin", version: "1.8.20" },
    starter: `// Kotlin
data class Course(val title: String, val credits: Int)

fun main() {
    println("Hello, World from Kotlin!")
    val courses = listOf(
        Course("Data Structures", 4),
        Course("Machine Learning", 3),
        Course("Web Systems", 3)
    )
    val totalCredits = courses.sumOf { it.credits }
    println("Total Credits: $totalCredits")
    courses.forEach { println(" - \${it.title} (\${it.credits} cr)") }
}
`,
  },
  {
    id: "swift",
    label: "Swift",
    categories: ["Mainstream", "Mobile"],
    icon: "🦅",
    color: "#f97316",
    monaco: "swift",
    ext: "swift",
    piston: { language: "swift", version: "5.3.3" },
    starter: `// Swift
import Foundation

print("Hello, World!")

struct Task {
    let title: String
    var isDone: Bool
}

var tasks = [
    Task(title: "Read Chapter 4", isDone: true),
    Task(title: "Complete Lab 2", isDone: false),
    Task(title: "Review Quiz", isDone: false)
]

print("Pending Tasks:")
for task in tasks.filter({ !$0.isDone }) {
    print(" [ ] \\(task.title)")
}
`,
  },
  {
    id: "php",
    label: "PHP",
    categories: ["Mainstream", "Web", "Scripting"],
    icon: "🐘",
    color: "#7c3aed",
    monaco: "php",
    ext: "php",
    piston: { language: "php", version: "8.2.3" },
    starter: `<?php
// PHP 8
echo "Hello, World!\\n";

$grades = ["Alice" => 94, "Bob" => 82, "Charlie" => 88];
arsort($grades);

foreach ($grades as $student => $score) {
    $status = match(true) {
        $score >= 90 => "A (Honor Roll)",
        $score >= 80 => "B (Good Standing)",
        default => "C"
    };
    echo "$student: $score -> $status\\n";
}
`,
  },
  {
    id: "ruby",
    label: "Ruby",
    categories: ["Mainstream", "Scripting", "Web"],
    icon: "💎",
    color: "#ef4444",
    monaco: "ruby",
    ext: "rb",
    piston: { language: "ruby", version: "3.0.1" },
    starter: `# Ruby
puts "Hello, World!"

class Book
  attr_reader :title, :author
  def initialize(title, author)
    @title, @author = title, author
  end
  def to_s = "«#{@title}» by #{@author}"
end

books = [
  Book.new("The Pragmatic Programmer", "Hunt & Thomas"),
  Book.new("Clean Code", "Robert C. Martin")
]

books.each { |b| puts "📚 #{b}" }
`,
  },
  {
    id: "dart",
    label: "Dart",
    categories: ["Mainstream", "Mobile", "Web"],
    icon: "🎯",
    color: "#06b6d4",
    monaco: "dart",
    ext: "dart",
    piston: { language: "dart", version: "2.19.6" },
    starter: `// Dart (Flutter language)
void main() {
  print('Hello, World!');
  
  final numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  final evens = numbers.where((n) => n.isEven).map((n) => n * n);
  
  print('Squares of evens: \${evens.toList()}');
}
`,
  },
  {
    id: "objective-c",
    label: "Objective-C",
    categories: ["Mainstream", "Mobile"],
    icon: "🍎",
    color: "#0284c7",
    monaco: "objective-c",
    ext: "m",
    piston: null,
    starter: `// Objective-C
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSLog(@"Hello, World from Objective-C!");
        
        NSArray *languages = @[@"Objective-C", @"Swift", @"C", @"C++"];
        for (NSString *lang in languages) {
            NSLog(@"Apple Platform: %@", lang);
        }
    }
    return 0;
}
`,
    simulatedOutput: `2026-09-06 18:00:00.000 main[4821:1002] Hello, World from Objective-C!
2026-09-06 18:00:00.001 main[4821:1002] Apple Platform: Objective-C
2026-09-06 18:00:00.001 main[4821:1002] Apple Platform: Swift
2026-09-06 18:00:00.001 main[4821:1002] Apple Platform: C
2026-09-06 18:00:00.002 main[4821:1002] Apple Platform: C++
`,
  },
  {
    id: "vbnet",
    label: "Visual Basic .NET",
    categories: ["Mainstream", ".NET", "Older & Legacy"],
    icon: "🔷",
    color: "#2563eb",
    monaco: "vb",
    ext: "vb",
    piston: { language: "basic.net", version: "5.0.201" },
    starter: `' Visual Basic .NET
Imports System

Module Program
    Sub Main()
        Console.WriteLine("Hello, World from VB.NET!")
        Dim nums() As Integer = {1, 2, 3, 4, 5}
        For Each n In nums
            Console.WriteLine(String.Format("{0}^2 = {1}", n, n * n))
        Next
    End Sub
End Module
`,
  },

  // ==========================================
  // 2. FUNCTIONAL
  // ==========================================
  {
    id: "haskell",
    label: "Haskell",
    categories: ["Functional"],
    icon: "🎩",
    color: "#7c3aed",
    monaco: "haskell",
    ext: "hs",
    piston: { language: "haskell", version: "9.0.1" },
    starter: `-- Haskell
main :: IO ()
main = do
  putStrLn "Hello, World!"
  let fibs = 0 : 1 : zipWith (+) fibs (tail fibs)
  putStrLn $ "First 10 Fibonaccis: " ++ show (take 10 fibs)
  let quicksort [] = []
      quicksort (x:xs) = quicksort [y | y <- xs, y <= x] ++ [x] ++ quicksort [y | y <- xs, y > x]
  putStrLn $ "Sorted list: " ++ show (quicksort [3, 1, 4, 1, 5, 9, 2, 6, 5])
`,
  },
  {
    id: "erlang",
    label: "Erlang",
    categories: ["Functional"],
    icon: "📡",
    color: "#dc2626",
    monaco: "erlang",
    ext: "erl",
    piston: { language: "erlang", version: "23.0.0" },
    starter: `% Erlang
-module(main).
-export([start/0]).

start() ->
    io:format("Hello, World from Erlang!~n"),
    List = [1, 2, 3, 4, 5],
    Squares = [X * X || X <- List],
    io:format("Squares: ~w~n", [Squares]).
`,
  },
  {
    id: "elixir",
    label: "Elixir",
    categories: ["Functional"],
    icon: "💜",
    color: "#8b5cf6",
    monaco: "elixir",
    ext: "ex",
    piston: { language: "elixir", version: "1.11.3" },
    starter: `# Elixir
IO.puts("Hello, World from Elixir!")

squares = 1..10
  |> Enum.filter(&(rem(&1, 2) == 0))
  |> Enum.map(&(&1 * &1))

IO.inspect(squares, label: "Even squares")
`,
  },
  {
    id: "fsharp",
    label: "F#",
    categories: ["Functional", ".NET"],
    icon: "🔵",
    color: "#3b82f6",
    monaco: "fsharp",
    ext: "fs",
    piston: { language: "fsi", version: "5.0.201" },
    starter: `// F#
printfn "Hello, World!"

let rec factorial n =
    if n <= 1 then 1
    else n * factorial (n - 1)

[1..8]
|> List.map (fun i -> sprintf "%d! = %d" i (factorial i))
|> List.iter (printfn "%s")
`,
  },
  {
    id: "scala",
    label: "Scala",
    categories: ["Functional", "JVM"],
    icon: "🔴",
    color: "#dc2626",
    monaco: "scala",
    ext: "scala",
    piston: { language: "scala", version: "3.2.2" },
    starter: `// Scala 3
@main def run() =
  println("Hello, World!")
  val nums = (1 to 10).toList
  val sumOfSquares = nums.map(x => x * x).sum
  println(s"Sum of squares 1..10 = $sumOfSquares")
`,
  },
  {
    id: "clojure",
    label: "Clojure",
    categories: ["Functional", "JVM"],
    icon: "🟢",
    color: "#10b981",
    monaco: "clojure",
    ext: "clj",
    piston: { language: "clojure", version: "1.10.3" },
    starter: `; Clojure
(println "Hello, World!")

(defn fib [n]
  (take n
    (map first (iterate (fn [[a b]] [b (+ a b)]) [0 1]))))

(println "Fibonacci:" (fib 10))
`,
  },
  {
    id: "ocaml",
    label: "OCaml",
    categories: ["Functional"],
    icon: "🐪",
    color: "#f59e0b",
    monaco: "ocaml",
    ext: "ml",
    piston: { language: "ocaml", version: "4.12.0" },
    starter: `(* OCaml *)
let () =
  print_endline "Hello, World!";
  let rec fib n =
    if n <= 1 then n else fib (n - 1) + fib (n - 2)
  in
  for i = 0 to 9 do
    Printf.printf "fib(%d) = %d\\n" i (fib i)
  done
`,
  },
  {
    id: "scheme",
    label: "Scheme",
    categories: ["Functional"],
    icon: "λ",
    color: "#ef4444",
    monaco: "scheme",
    ext: "scm",
    piston: { language: "racket", version: "8.3.0" },
    starter: `; Scheme (R5RS)
#lang racket
(displayln "Hello, World!")

(define (factorial n)
  (if (<= n 1) 1
      (* n (factorial (- n 1)))))

(displayln (format "10! = ~a" (factorial 10)))
`,
  },
  {
    id: "racket",
    label: "Racket",
    categories: ["Functional"],
    icon: "🟣",
    color: "#8b5cf6",
    monaco: "scheme",
    ext: "rkt",
    piston: { language: "racket", version: "8.3.0" },
    starter: `#lang racket
;; Racket
(displayln "Hello, World from Racket!")

(define (squares lst)
  (map (lambda (x) (* x x)) lst))

(printf "Squares: ~a\\n" (squares '(1 2 3 4 5)))
`,
  },
  {
    id: "sml",
    label: "Standard ML",
    categories: ["Functional"],
    icon: "📜",
    color: "#475569",
    monaco: "ocaml",
    ext: "sml",
    piston: null,
    starter: `(* Standard ML (SML'97) *)
val () = print "Hello, World from Standard ML!\\n";

fun factorial 0 = 1
  | factorial n = n * factorial (n - 1);

val results = List.tabulate (6, fn i => (i, factorial i));
val () = List.app (fn (i, f) => print (Int.toString i ^ "! = " ^ Int.toString f ^ "\\n")) results;
`,
    simulatedOutput: `Hello, World from Standard ML!
0! = 1
1! = 1
2! = 2
3! = 6
4! = 24
5! = 120
[val it = () : unit]
`,
  },
  {
    id: "elm",
    label: "Elm",
    categories: ["Functional", "Web"],
    icon: "🌳",
    color: "#10b981",
    monaco: "haskell",
    ext: "elm",
    piston: null,
    starter: `-- Elm
module Main exposing (main)

import Html exposing (text)

greeting : String -> String
greeting name =
    "Hello, " ++ name ++ " from Elm!"

main =
    text (greeting "World")
`,
    simulatedOutput: `[Elm Compiler 0.19.1]
Dependencies loaded successfully.
Compiled Main.elm -> Virtual DOM rendered:
"Hello, World from Elm!"
`,
  },
  {
    id: "purescript",
    label: "PureScript",
    categories: ["Functional", "Web"],
    icon: "💧",
    color: "#0891b2",
    monaco: "haskell",
    ext: "purs",
    piston: null,
    starter: `-- PureScript
module Main where

import Prelude
import Effect (Effect)
import Effect.Console (log)

main :: Effect Unit
main = do
  log "Hello, World from PureScript!"
  let squares = map (\\x -> x * x) [1, 2, 3, 4, 5]
  log $ "Squares: " <> show squares
`,
    simulatedOutput: `[Purs 0.15.8] Compiling project...
Successfully compiled 1 module.
Hello, World from PureScript!
Squares: [1,4,9,16,25]
`,
  },

  // ==========================================
  // 3. SYSTEMS / LOW-LEVEL
  // ==========================================
  {
    id: "zig",
    label: "Zig",
    categories: ["Systems"],
    icon: "⚡",
    color: "#f59e0b",
    monaco: "c",
    ext: "zig",
    piston: { language: "zig", version: "0.10.1" },
    starter: `// Zig
const std = @import("std");

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Hello, World from Zig!\\n", .{});
    
    var sum: u32 = 0;
    var i: u32 = 1;
    while (i <= 10) : (i += 1) {
        sum += i;
    }
    try stdout.print("Sum of 1..10 = {d}\\n", .{sum});
}
`,
  },
  {
    id: "nasm",
    label: "Assembly (x86)",
    categories: ["Systems"],
    icon: "⚙️",
    color: "#64748b",
    monaco: "asm",
    ext: "asm",
    piston: { language: "nasm", version: "2.15.5" },
    starter: `; Assembly (x86 Linux 32-bit)
section .data
    msg db 'Hello, World from x86 Assembly!', 0xA
    len equ $ - msg

section .text
    global _start

_start:
    ; sys_write (eax = 4, ebx = 1 = stdout, ecx = msg, edx = len)
    mov eax, 4
    mov ebx, 1
    mov ecx, msg
    mov edx, len
    int 0x80

    ; sys_exit (eax = 1, ebx = 0)
    mov eax, 1
    xor ebx, ebx
    int 0x80
`,
  },
  {
    id: "nasm64",
    label: "Assembly (x86-64)",
    categories: ["Systems"],
    icon: "🔩",
    color: "#475569",
    monaco: "asm",
    ext: "asm",
    piston: { language: "nasm64", version: "2.15.5" },
    starter: `; Assembly (x86-64 Linux 64-bit)
section .data
    msg db 'Hello, World from x86-64 Assembly!', 10
    len equ $ - msg

section .text
    global _start

_start:
    ; sys_write(fd=1, buf=msg, count=len)
    mov rax, 1
    mov rdi, 1
    mov rsi, msg
    mov rdx, len
    syscall

    ; sys_exit(0)
    mov rax, 60
    xor rdi, rdi
    syscall
`,
  },
  {
    id: "arm-asm",
    label: "Assembly (ARM)",
    categories: ["Systems"],
    icon: "🦾",
    color: "#059669",
    monaco: "asm",
    ext: "s",
    piston: null,
    starter: `// ARM Assembly (AArch64)
.global _start
.text

_start:
    // write(1, msg, len)
    mov     x0, #1          // stdout
    ldr     x1, =msg        // pointer to message
    mov     x2, #29         // message length
    mov     x8, #64         // sys_write syscall
    svc     #0

    // exit(0)
    mov     x0, #0
    mov     x8, #93         // sys_exit syscall
    svc     #0

.data
msg:
    .ascii  "Hello, World from ARM64 ASM!\\n"
`,
    simulatedOutput: `[ARM64 Architecture Emulation]
Registers initialized: x0=0, x1-x30=0, SP=0x7ffffff0
Executing sys_write(fd: 1, buf: 0x4000f0, count: 29)...
Hello, World from ARM64 ASM!
Program exited with status 0 (sys_exit).
`,
  },
  {
    id: "mips-asm",
    label: "Assembly (MIPS)",
    categories: ["Systems"],
    icon: "📼",
    color: "#d97706",
    monaco: "mips",
    ext: "s",
    piston: null,
    starter: `# MIPS Assembly
.data
msg: .asciiz "Hello, World from MIPS Assembly!\\n"

.text
.globl main
main:
    # Print string syscall (4)
    li $v0, 4
    la $a0, msg
    syscall

    # Exit syscall (10)
    li $v0, 10
    syscall
`,
    simulatedOutput: `[MIPS32 Simulator - SPIM/MARS Compatible]
Loaded text segment: 0x00400000
Loaded data segment: 0x10010000
Executing program...
Hello, World from MIPS Assembly!
Instruction count: 4 | Cycles: 4
Program finished execution with return code 0.
`,
  },
  {
    id: "ada",
    label: "Ada",
    categories: ["Systems", "Older & Legacy"],
    icon: "🛡️",
    color: "#0284c7",
    monaco: "pascal",
    ext: "adb",
    piston: null,
    starter: `-- Ada 2012
with Ada.Text_IO; use Ada.Text_IO;

procedure Hello is
begin
   Put_Line ("Hello, World from Ada!");
   for I in 1 .. 5 loop
      Put_Line ("Step:" & Integer'Image (I) & " | Safe & Mission-Critical");
   end loop;
end Hello;
`,
    simulatedOutput: `[GNAT Ada Compiler 12.2]
gcc -c hello.adb
gnatbind hello.ali
gnatlink hello.ali
Running ./hello...
Hello, World from Ada!
Step: 1 | Safe & Mission-Critical
Step: 2 | Safe & Mission-Critical
Step: 3 | Safe & Mission-Critical
Step: 4 | Safe & Mission-Critical
Step: 5 | Safe & Mission-Critical
`,
  },
  {
    id: "d",
    label: "D",
    categories: ["Systems"],
    icon: "🔷",
    color: "#ef4444",
    monaco: "d",
    ext: "d",
    piston: { language: "d", version: "10.2.0" },
    starter: `// D
import std.stdio;

void main() {
    writeln("Hello, World from D!");
    foreach (i; 1 .. 6) {
        writefln("%d squared is %d", i, i * i);
    }
}
`,
  },
  {
    id: "nim",
    label: "Nim",
    categories: ["Systems", "Scripting"],
    icon: "👑",
    color: "#f59e0b",
    monaco: "python",
    ext: "nim",
    piston: { language: "nim", version: "1.6.2" },
    starter: `# Nim
echo "Hello, World from Nim!"

proc fibonacci(n: int): seq[int] =
  result = @[0, 1]
  for i in 2..<n:
    result.add(result[i - 1] + result[i - 2])

echo "Fibonacci sequence: ", fibonacci(10)
`,
  },
  {
    id: "carbon",
    label: "Carbon",
    categories: ["Systems"],
    icon: "💎",
    color: "#3b82f6",
    monaco: "cpp",
    ext: "carbon",
    piston: null,
    starter: `// Carbon (Experimental successor to C++)
package Geometry api;

fn Square(x: i32) -> i32 {
  return x * x;
}

fn Main() -> i32 {
  Print("Hello, World from Carbon Language!");
  var i: i32 = 1;
  while (i <= 5) {
    Print("i={0}, i^2={1}", i, Square(i));
    i += 1;
  }
  return 0;
}
`,
    simulatedOutput: `[Carbon Explorer v0.1.0]
Compiling Geometry package...
AST verification passed.
Hello, World from Carbon Language!
i=1, i^2=1
i=2, i^2=4
i=3, i^2=9
i=4, i^2=16
i=5, i^2=25
`,
  },

  // ==========================================
  // 4. SCRIPTING / SHELL
  // ==========================================
  {
    id: "bash",
    label: "Bash",
    categories: ["Scripting"],
    icon: "💻",
    color: "#10b981",
    monaco: "shell",
    ext: "sh",
    piston: { language: "bash", version: "5.2.0" },
    starter: `#!/bin/bash
# Bash Script
echo "Hello, World!"

echo "Current date: $(date +'%Y-%m-%d %H:%M:%S')"

for i in {1..5}; do
    echo "Processing batch item #$i (square: $((i * i)))"
done
`,
  },
  {
    id: "zsh",
    label: "Zsh",
    categories: ["Scripting"],
    icon: "🐚",
    color: "#059669",
    monaco: "shell",
    ext: "zsh",
    piston: { language: "bash", version: "5.2.0" },
    starter: `#!/bin/zsh
# Zsh
echo "Hello, World from Zsh!"

typeset -A colors
colors=(red "#ef4444" green "#22c55e" blue "#3b82f6")

for key val in "\${(@kv)colors}"; do
    echo "Color: $key -> $val"
done
`,
  },
  {
    id: "powershell",
    label: "PowerShell",
    categories: ["Scripting", ".NET"],
    icon: "💙",
    color: "#2563eb",
    monaco: "powershell",
    ext: "ps1",
    piston: { language: "powershell", version: "7.1.4" },
    starter: `# PowerShell
Write-Host "Hello, World from PowerShell!" -ForegroundColor Cyan

1..5 | ForEach-Object {
    [PSCustomObject]@{
        Number = $_
        Square = $_ * $_
        Cube   = [Math]::Pow($_, 3)
    }
} | Format-Table
`,
  },
  {
    id: "perl",
    label: "Perl",
    categories: ["Scripting"],
    icon: "🐪",
    color: "#0891b2",
    monaco: "perl",
    ext: "pl",
    piston: { language: "perl", version: "5.36.0" },
    starter: `#!/usr/bin/perl
# Perl 5
use strict;
use warnings;

print "Hello, World!\\n";

my %fruits = (apple => "red", banana => "yellow", lime => "green");
while (my ($fruit, $color) = each %fruits) {
    print "$fruit is $color\\n";
}
`,
  },
  {
    id: "lua",
    label: "Lua",
    categories: ["Scripting", "Game Dev"],
    icon: "🌙",
    color: "#6366f1",
    monaco: "lua",
    ext: "lua",
    piston: { language: "lua", version: "5.4.4" },
    starter: `-- Lua 5.4
print("Hello, World from Lua!")

local function greet(name)
    return "Welcome to Smart Education, " .. name
end

print(greet("Explorer"))

local tbl = {10, 20, 30, 40, 50}
for i, v in ipairs(tbl) do
    print(string.format("Index %d -> Value %d", i, v))
end
`,
  },
  {
    id: "awk",
    label: "AWK",
    categories: ["Scripting"],
    icon: "🔤",
    color: "#64748b",
    monaco: "plaintext",
    ext: "awk",
    piston: { language: "awk", version: "5.1.0" },
    starter: `# AWK
BEGIN {
    print "Hello, World from AWK!"
    print "------------------------"
    printf "%-10s %-10s\\n", "Number", "Square"
    for (i = 1; i <= 5; i++) {
        printf "%-10d %-10d\\n", i, i * i
    }
}
`,
  },
  {
    id: "tcl",
    label: "Tcl",
    categories: ["Scripting"],
    icon: "🪶",
    color: "#0284c7",
    monaco: "tcl",
    ext: "tcl",
    piston: null,
    starter: `# Tcl (Tool Command Language)
puts "Hello, World from Tcl!"

set numbers {1 2 3 4 5}
foreach n $numbers {
    set sq [expr {$n * $n}]
    puts "$n squared = $sq"
}
`,
    simulatedOutput: `Hello, World from Tcl!
1 squared = 1
2 squared = 4
3 squared = 9
4 squared = 16
5 squared = 25
`,
  },
  {
    id: "sh",
    label: "POSIX sh",
    categories: ["Scripting"],
    icon: "🐚",
    color: "#059669",
    monaco: "shell",
    ext: "sh",
    piston: { language: "dash", version: "0.5.11" },
    starter: `#!/bin/sh
# POSIX Shell
echo "Hello, World from /bin/sh!"
i=1
while [ "$i" -le 5 ]; do
    echo "Counter: $i"
    i=$((i + 1))
done
`,
  },

  // ==========================================
  // 5. WEB
  // ==========================================
  {
    id: "html",
    label: "HTML5",
    categories: ["Web"],
    icon: "🌐",
    color: "#f97316",
    monaco: "html",
    ext: "html",
    piston: null,
    isLivePreview: true,
    starter: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Smart Education Preview</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .card {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px;
      padding: 1.5rem 2rem;
      text-align: center;
      max-width: 400px;
    }
    h1 { color: #818cf8; margin-top: 0; }
    button {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎓 Smart Education</h1>
    <p>Live HTML/CSS Preview Environment</p>
    <button onclick="alert('Hello from HTML!')">Click Me</button>
  </div>
</body>
</html>
`,
  },
  {
    id: "css",
    label: "CSS3",
    categories: ["Web"],
    icon: "🎨",
    color: "#3b82f6",
    monaco: "css",
    ext: "css",
    piston: null,
    isLivePreview: true,
    starter: `/* Modern Glassmorphic Design Token Stylesheet */
:root {
  --primary: #6366f1;
  --secondary: #ec4899;
  --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: 1px solid rgba(255, 255, 255, 0.12);
  --shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.dashboard-card {
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: var(--card-border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 24px;
  transition: transform 0.2s ease;
}

.dashboard-card:hover {
  transform: translateY(-4px);
}
`,
    simulatedOutput: `/* CSS Validator (W3C CSS Level 3) */
Status: Valid CSS!
Parsed Rules: 3 rules, 8 CSS variables
Tokens validated with 0 errors and 0 warnings.
`,
  },
  {
    id: "coffeescript",
    label: "CoffeeScript",
    categories: ["Web", "Scripting"],
    icon: "☕",
    color: "#78350f",
    monaco: "coffeescript",
    ext: "coffee",
    piston: { language: "coffeescript", version: "2.5.1" },
    starter: `# CoffeeScript
console.log "Hello, World from CoffeeScript!"

square = (x) -> x * x

cubes = (math.cube num for num in [1..5])

student =
  name: "Alice"
  greet: -> "Hello, #{@name}!"

console.log student.greet()
`,
  },
  {
    id: "wat",
    label: "WebAssembly (WAT)",
    categories: ["Web", "Systems"],
    icon: "🕸️",
    color: "#6366f1",
    monaco: "plaintext",
    ext: "wat",
    piston: null,
    starter: `;; WebAssembly Text Format (WAT)
(module
  ;; Function that adds two 32-bit integers
  (func $add (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.add)
  (export "add" (func $add))

  ;; Main entry calculating 40 + 2
  (func $main (result i32)
    i32.const 40
    i32.const 2
    call $add)
  (export "main" (func $main))
)
`,
    simulatedOutput: `[WebAssembly Runtime]
Compiled module from WAT representation.
Exported functions: ["add", "main"]
Invoking main()...
Result: 42 (i32)
add(15, 27) = 42
Execution successful. Memory allocated: 64KB (1 page).
`,
  },

  // ==========================================
  // 6. DATA / SCIENTIFIC / STATISTICAL
  // ==========================================
  {
    id: "r",
    label: "R",
    categories: ["Data & Science"],
    icon: "📊",
    color: "#2563eb",
    monaco: "r",
    ext: "r",
    piston: { language: "rscript", version: "4.1.1" },
    starter: `# R
cat("Hello, World!\\n")

scores <- c(72, 85, 90, 65, 88, 95, 78)
cat("Scores:", scores, "\\n")
cat("Mean:  ", mean(scores), "\\n")
cat("Median:", median(scores), "\\n")
cat("Std Dev:", round(sd(scores), 2), "\\n")
cat("Summary Statistics:\\n")
print(summary(scores))
`,
  },
  {
    id: "julia",
    label: "Julia",
    categories: ["Data & Science", "Systems"],
    icon: "🟣",
    color: "#8b5cf6",
    monaco: "julia",
    ext: "jl",
    piston: { language: "julia", version: "1.8.5" },
    starter: `# Julia
println("Hello, World from Julia!")

function monte_carlo_pi(n)
    inside = 0
    for _ in 1:n
        x, y = rand(), rand()
        if x^2 + y^2 <= 1.0
            inside += 1
        end
    end
    return 4 * inside / n
end

println("Monte Carlo Pi (100,000 samples): ", monte_carlo_pi(100_000))
`,
  },
  {
    id: "matlab",
    label: "MATLAB",
    categories: ["Data & Science"],
    icon: "🔢",
    color: "#d97706",
    monaco: "octave",
    ext: "m",
    piston: { language: "octave", version: "8.1.0" },
    starter: `% MATLAB
disp('Hello, World from MATLAB!');

A = [1, 2; 3, 4];
B = [5, 6; 7, 8];
disp('Matrix Multiplication A * B:');
disp(A * B);

x = 1:5;
y = x .^ 2;
disp('x:'); disp(x);
disp('x.^2:'); disp(y);
`,
  },
  {
    id: "octave",
    label: "GNU Octave",
    categories: ["Data & Science"],
    icon: "📉",
    color: "#0891b2",
    monaco: "octave",
    ext: "m",
    piston: { language: "octave", version: "8.1.0" },
    starter: `% GNU Octave
printf("Hello, World from GNU Octave %s\\n", version());

A = [1 2 3; 4 5 6; 7 8 9];
printf("Trace of A: %d\\n", trace(A));
printf("Eigenvalues:\\n");
disp(eig([2 1; 1 2]));
`,
  },
  {
    id: "sas",
    label: "SAS",
    categories: ["Data & Science"],
    icon: "📈",
    color: "#0284c7",
    monaco: "sql",
    ext: "sas",
    piston: null,
    starter: `/* SAS (Statistical Analysis System) */
DATA students;
    INPUT Name $ Score Attendance;
    DATALINES;
Alice 94 98
Bob 78 85
Charlie 88 92
Dana 91 95
;
RUN;

PROC MEANS DATA=students MEAN STD MIN MAX;
    VAR Score Attendance;
RUN;
`,
    simulatedOutput: `The SAS System

                  The MEANS Procedure

Variable      Mean        Std Dev        Minimum        Maximum
---------------------------------------------------------------
Score      87.7500         7.0415        78.0000        94.0000
Attendance 92.5000         5.5678        85.0000        98.0000
---------------------------------------------------------------
NOTE: DATA step executed with 4 observations and 3 variables.
`,
  },
  {
    id: "spss",
    label: "SPSS Syntax",
    categories: ["Data & Science"],
    icon: "📋",
    color: "#b45309",
    monaco: "plaintext",
    ext: "sps",
    piston: null,
    starter: `* SPSS Syntax.
DATA LIST FREE / id score grade.
BEGIN DATA.
1 92 4
2 85 3
3 78 3
4 96 4
5 64 2
END DATA.

DESCRIPTIVES VARIABLES=score
  /STATISTICS=MEAN STDDEV MIN MAX.
EXECUTE.
`,
    simulatedOutput: `Descriptive Statistics (IBM SPSS Statistics 28)
--------------------------------------------------------
                 N    Minimum   Maximum      Mean    Std. Deviation
score            5      64.00     96.00   83.0000          12.4499
Valid N (list)   5
--------------------------------------------------------
Procedure executed successfully.
`,
  },
  {
    id: "wolfram",
    label: "Wolfram Language",
    categories: ["Data & Science"],
    icon: "🔴",
    color: "#dc2626",
    monaco: "mathematica",
    ext: "wl",
    piston: null,
    starter: `(* Wolfram Language / Mathematica *)
Print["Hello, World from Wolfram Language!"]

primes = Prime[Range[10]]
Print["First 10 primes: ", primes]

integral = Integrate[x^2 * Sin[x], x]
Print["Indefinite integral of x^2*Sin[x]: ", integral]
`,
    simulatedOutput: `Hello, World from Wolfram Language!
First 10 primes: {2, 3, 5, 7, 11, 13, 17, 19, 23, 29}
Indefinite integral of x^2*Sin[x]: 2 x Sin[x] - (-2 + x^2) Cos[x]
`,
  },

  // ==========================================
  // 7. QUERY / DATABASE
  // ==========================================
  {
    id: "sql",
    label: "SQL (SQLite)",
    categories: ["Query & DB"],
    icon: "🗃️",
    color: "#0891b2",
    monaco: "sql",
    ext: "sql",
    piston: { language: "sqlite3", version: "3.36.0" },
    starter: `-- SQL
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  grade INTEGER NOT NULL
);

INSERT INTO students VALUES
  (1, 'Alice Smith', 'CompSci', 95),
  (2, 'Bob Johnson', 'Math', 78),
  (3, 'Charlie Brown', 'CompSci', 88),
  (4, 'Diana Prince', 'Physics', 92);

SELECT 
  course,
  COUNT(*) as total_students,
  ROUND(AVG(grade), 1) as avg_grade
FROM students
GROUP BY course
ORDER BY avg_grade DESC;
`,
  },
  {
    id: "plsql",
    label: "PL/SQL (Oracle)",
    categories: ["Query & DB"],
    icon: "🏛️",
    color: "#dc2626",
    monaco: "sql",
    ext: "pls",
    piston: null,
    starter: `-- Oracle PL/SQL
DECLARE
    v_student_name VARCHAR2(50) := 'Alice';
    v_score NUMBER := 95;
    v_letter_grade CHAR(1);
BEGIN
    DBMS_OUTPUT.PUT_LINE('Executing PL/SQL Block...');
    
    IF v_score >= 90 THEN
        v_letter_grade := 'A';
    ELSIF v_score >= 80 THEN
        v_letter_grade := 'B';
    ELSE
        v_letter_grade := 'C';
    END IF;
    
    DBMS_OUTPUT.PUT_LINE('Student: ' || v_student_name || ' | Grade: ' || v_letter_grade);
END;
/
`,
    simulatedOutput: `Executing PL/SQL Block...
Student: Alice | Grade: A
PL/SQL procedure successfully completed.
Commit complete.
`,
  },
  {
    id: "tsql",
    label: "T-SQL (SQL Server)",
    categories: ["Query & DB"],
    icon: "🗄️",
    color: "#0284c7",
    monaco: "sql",
    ext: "sql",
    piston: null,
    starter: `-- Microsoft T-SQL
DECLARE @CourseName NVARCHAR(50) = 'Computer Science';
DECLARE @PassThreshold INT = 75;

SELECT 
    StudentID,
    FullName,
    Score,
    CASE 
        WHEN Score >= 90 THEN 'Distinction'
        WHEN Score >= @PassThreshold THEN 'Pass'
        ELSE 'Review Needed'
    END AS Standing
FROM (VALUES 
    (1, 'Alice', 94),
    (2, 'Bob', 68),
    (3, 'Charlie', 85)
) AS Students(StudentID, FullName, Score);
`,
    simulatedOutput: `(3 rows affected)
StudentID   FullName   Score   Standing
------------------------------------------------
1           Alice      94      Distinction
2           Bob        68      Review Needed
3           Charlie    85      Pass
Completion time: 2026-09-06 18:00:00
`,
  },
  {
    id: "graphql",
    label: "GraphQL",
    categories: ["Query & DB", "Web"],
    icon: "⬡",
    color: "#e535ab",
    monaco: "graphql",
    ext: "gql",
    piston: null,
    starter: `# GraphQL Query & Schema Definition
type Student {
  id: ID!
  name: String!
  enrolledCourses: [Course!]!
}

type Course {
  code: String!
  name: String!
  credits: Int!
}

query GetStudentProfile {
  student(id: "101") {
    name
    enrolledCourses {
      code
      name
      credits
    }
  }
}
`,
    simulatedOutput: `{
  "data": {
    "student": {
      "name": "Alice Smith",
      "enrolledCourses": [
        { "code": "CS101", "name": "Intro to Programming", "credits": 4 },
        { "code": "MATH201", "name": "Linear Algebra", "credits": 3 }
      ]
    }
  }
}
`,
  },
  {
    id: "sparql",
    label: "SPARQL",
    categories: ["Query & DB"],
    icon: "🕸️",
    color: "#3b82f6",
    monaco: "sql",
    ext: "rq",
    piston: null,
    starter: `# SPARQL Protocol and RDF Query Language
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX edu: <http://smarteducation.org/ontology/>

SELECT ?studentName ?courseTitle ?grade
WHERE {
  ?student rdf:type edu:Student ;
           edu:name ?studentName ;
           edu:enrolledIn ?enrollment .
  ?enrollment edu:course ?course ;
              edu:grade ?grade .
  ?course edu:title ?courseTitle .
  FILTER (?grade >= 90)
}
ORDER BY DESC(?grade)
`,
    simulatedOutput: `+-----------------+---------------------------+-------+
| ?studentName    | ?courseTitle              | ?grade|
+-----------------+---------------------------+-------+
| "Alice Smith"   | "Artificial Intelligence" | 98    |
| "Diana Prince"  | "Quantum Computing"       | 95    |
+-----------------+---------------------------+-------+
2 matches found in graph store. Query time: 14ms.
`,
  },
  {
    id: "cypher",
    label: "Cypher (Neo4j)",
    categories: ["Query & DB"],
    icon: "🕸️",
    color: "#10b981",
    monaco: "sql",
    ext: "cyp",
    piston: null,
    starter: `// Neo4j Cypher Graph Query
MATCH (s:Student)-[r:ENROLLED_IN]->(c:Course)
WHERE c.semester = 'Fall 2026'
RETURN s.name AS Student, 
       c.title AS Course, 
       r.grade AS Grade,
       r.attendanceRate AS Attendance
ORDER BY r.grade DESC
LIMIT 5;
`,
    simulatedOutput: `Cypher Execution Plan:
Plan: NodeByLabelScan -> Expand(All) -> Filter -> ProduceResults
+----------------+--------------------+-------+------------+
| Student        | Course             | Grade | Attendance |
+----------------+--------------------+-------+------------+
| "Alice Smith"  | "Data Structures"  | 98    | 0.99       |
| "Charlie Ross" | "Algorithms"       | 92    | 0.95       |
| "Diana Prince" | "Computer Networks"| 90    | 0.94       |
+----------------+--------------------+-------+------------+
3 records returned (in 8ms).
`,
  },
  {
    id: "dax",
    label: "DAX (Power BI)",
    categories: ["Query & DB", "Data & Science"],
    icon: "📊",
    color: "#eab308",
    monaco: "msdax",
    ext: "dax",
    piston: null,
    starter: `// DAX (Data Analysis Expressions for Power BI & Analysis Services)
EVALUATE
SUMMARIZECOLUMNS(
    Students[Department],
    "Total Students", COUNTROWS(Students),
    "Avg Exam Score", AVERAGE(Grades[FinalScore]),
    "Pass Rate", DIVIDE(
        CALCULATE(COUNTROWS(Grades), Grades[FinalScore] >= 70),
        COUNTROWS(Grades)
    )
)
ORDER BY [Avg Exam Score] DESC
`,
    simulatedOutput: `[DAX Engine Evaluation - Power BI / SSAS]
Department           Total Students   Avg Exam Score   Pass Rate
----------------------------------------------------------------
Computer Science     142              88.4             94.2%
Mathematics          98               84.1             89.8%
Physics              76               82.6             88.2%
3 rows evaluated.
`,
  },

  // ==========================================
  // 8. OLDER / FOUNDATIONAL / LEGACY
  // ==========================================
  {
    id: "fortran",
    label: "Fortran",
    categories: ["Older & Legacy", "Systems", "Data & Science"],
    icon: "🏛️",
    color: "#6366f1",
    monaco: "fortran",
    ext: "f90",
    piston: { language: "fortran", version: "10.2.0" },
    starter: `! Fortran 90/95
program hello
    implicit none
    integer :: i
    real :: total = 0.0
    
    print *, "Hello, World from Fortran!"
    
    do i = 1, 5
        total = total + (real(i) ** 2)
        print *, "i =", i, " i^2 =", i**2
    end do
    
    print *, "Sum of squares =", total
end program hello
`,
  },
  {
    id: "cobol",
    label: "COBOL",
    categories: ["Older & Legacy"],
    icon: "🏢",
    color: "#64748b",
    monaco: "cobol",
    ext: "cbl",
    piston: { language: "cobol", version: "3.1.2" },
    starter: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO-WORLD.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-NAME PIC A(20) VALUE 'STUDENT'.
       01 WS-NUM1 PIC 9(2) VALUE 15.
       01 WS-NUM2 PIC 9(2) VALUE 25.
       01 WS-SUM  PIC 9(3).
       PROCEDURE DIVISION.
           DISPLAY 'HELLO, WORLD FROM COBOL!'.
           ADD WS-NUM1 TO WS-NUM2 GIVING WS-SUM.
           DISPLAY 'SUM OF ' WS-NUM1 ' AND ' WS-NUM2 ' IS: ' WS-SUM.
           STOP RUN.
`,
  },
  {
    id: "pascal",
    label: "Pascal",
    categories: ["Older & Legacy"],
    icon: "📜",
    color: "#7c3aed",
    monaco: "pascal",
    ext: "pas",
    piston: { language: "pascal", version: "3.2.2" },
    starter: `program Hello;
var
  i: integer;
begin
  writeln('Hello, World from Pascal!');
  for i := 1 to 5 do
  begin
    writeln('Item ', i, ' squared is ', i * i);
  end;
end.
`,
  },
  {
    id: "lisp",
    label: "Common Lisp",
    categories: ["Older & Legacy", "Functional"],
    icon: "🔴",
    color: "#dc2626",
    monaco: "lisp",
    ext: "lisp",
    piston: { language: "lisp", version: "2.1.2" },
    starter: `; Common Lisp (SBCL)
(format t "Hello, World from Common Lisp!~%")

(defun factorial (n)
  (if (<= n 1) 1
      (* n (factorial (- n 1)))))

(dotimes (i 6)
  (format t "~a! = ~a~%" i (factorial i)))
`,
  },
  {
    id: "basic",
    label: "BASIC",
    categories: ["Older & Legacy"],
    icon: "📟",
    color: "#475569",
    monaco: "vb",
    ext: "bas",
    piston: { language: "freebasic", version: "1.9.0" },
    starter: `' BASIC
Print "Hello, World from BASIC!"
For i As Integer = 1 To 5
    Print "Counter: "; i; " Squared: "; i * i
Next i
`,
  },
  {
    id: "algol",
    label: "Algol",
    categories: ["Older & Legacy"],
    icon: "📜",
    color: "#6b7280",
    monaco: "pascal",
    ext: "alg",
    piston: null,
    starter: `'BEGIN' 'COMMENT' Algol 60;
  'INTEGER' i, sum;
  sum := 0;
  outstring (1, "Hello, World from Algol 60!\\n");
  'FOR' i := 1 'STEP' 1 'UNTIL' 5 'DO'
    sum := sum + i * i;
  outinteger (1, sum);
'END'
`,
    simulatedOutput: `[Algol 60/68 Transpiler]
Program translated and executed via MARST:
Hello, World from Algol 60!
55
`,
  },
  {
    id: "pli",
    label: "PL/I",
    categories: ["Older & Legacy"],
    icon: "💾",
    color: "#475569",
    monaco: "plaintext",
    ext: "pli",
    piston: null,
    starter: `/* PL/I (IBM Mainframe) */
HELLO: PROCEDURE OPTIONS(MAIN);
   DECLARE NAME CHAR(20) INITIAL('STUDENT');
   PUT SKIP LIST('HELLO, WORLD FROM PL/I!');
   PUT SKIP LIST('WELCOME, ' || TRIM(NAME));
END HELLO;
`,
    simulatedOutput: `[IBM PL/I Enterprise Compiler]
Source lines compiled: 6.
Output:
HELLO, WORLD FROM PL/I!
WELCOME, STUDENT
Return Code: 0 (Successful execution)
`,
  },
  {
    id: "rpg",
    label: "RPG (IBM)",
    categories: ["Older & Legacy"],
    icon: "📼",
    color: "#334155",
    monaco: "plaintext",
    ext: "rpg",
    piston: null,
    starter: `**FREE
// RPG IV / RPGLE (IBM i)
Dcl-S Message Char(50) Inz('Hello, World from RPG IV!');
Dcl-S Count   Int(10)  Inz(5);
Dcl-S i       Int(10);

Dsply Message;
For i = 1 to Count;
  Dsply ('Loop iteration: ' + %Char(i));
EndFor;
*InLR = *On;
`,
    simulatedOutput: `DSPLY  Hello, World from RPG IV!
DSPLY  Loop iteration: 1
DSPLY  Loop iteration: 2
DSPLY  Loop iteration: 3
DSPLY  Loop iteration: 4
DSPLY  Loop iteration: 5
Job completed normally. Return code: 0
`,
  },
  {
    id: "forth",
    label: "Forth",
    categories: ["Older & Legacy"],
    icon: "📟",
    color: "#64748b",
    monaco: "plaintext",
    ext: "fth",
    piston: { language: "forth", version: "0.7.3" },
    starter: `\\ Forth (Stack-oriented programming)
: SQUARE DUP * ;
: .SQUARES 6 1 DO I SQUARE . LOOP ;

." Hello, World from Forth!" CR
." 1 to 5 squared: " .SQUARES CR
`,
  },
  {
    id: "simula",
    label: "Simula",
    categories: ["Older & Legacy"],
    icon: "🧬",
    color: "#2563eb",
    monaco: "pascal",
    ext: "sim",
    piston: null,
    starter: `BEGIN
   COMMENT The first Object-Oriented Language (Simula 67);
   CLASS Person(name); TEXT name;
   BEGIN
      PROCEDURE speak;
      BEGIN
         OutText("Hello from "); OutText(name); OutImage;
      END;
   END;

   REF(Person) p;
   p :- NEW Person("Simula 67 (Birth of OOP)");
   p.speak;
END;
`,
    simulatedOutput: `[Simula 67 cim compiler]
Compiling Simula class definitions...
Hello from Simula 67 (Birth of OOP)
Execution completed. 1 object instance disposed.
`,
  },
  {
    id: "smalltalk",
    label: "Smalltalk",
    categories: ["Older & Legacy"],
    icon: "🔵",
    color: "#3b82f6",
    monaco: "plaintext",
    ext: "st",
    piston: { language: "smalltalk", version: "3.2.3" },
    starter: `" Smalltalk "
Transcript showCr: 'Hello, World from Smalltalk!'.

1 to: 5 do: [ :i |
    Transcript showCr: (i printString, ' squared is ', (i * i) printString)
].
`,
  },

  // ==========================================
  // 9. JVM LANGUAGES
  // ==========================================
  {
    id: "groovy",
    label: "Groovy",
    categories: ["JVM", "Scripting"],
    icon: "🎸",
    color: "#4ade80",
    monaco: "groovy",
    ext: "groovy",
    piston: { language: "groovy", version: "3.0.7" },
    starter: `// Apache Groovy
println "Hello, World from Groovy!"

def list = [1, 2, 3, 4, 5]
println "Squares: " + list.collect { it * it }

def student = [name: "Alice", grade: "A"]
println "Student \${student.name} received grade \${student.grade}"
`,
  },

  // ==========================================
  // 10. HARDWARE DESCRIPTION (HDL)
  // ==========================================
  {
    id: "verilog",
    label: "Verilog",
    categories: ["Hardware (HDL)"],
    icon: "🔌",
    color: "#10b981",
    monaco: "verilog",
    ext: "v",
    piston: { language: "iverilog", version: "11.0.0" },
    starter: `// Verilog (HDL)
module main;
  reg [3:0] counter;
  
  initial begin
    $display("Hello, World from Verilog HDL!");
    counter = 4'b0000;
    repeat (5) begin
      counter = counter + 1;
      $display("Clock pulse: counter = %d", counter);
    end
    $finish;
  end
endmodule
`,
  },
  {
    id: "systemverilog",
    label: "SystemVerilog",
    categories: ["Hardware (HDL)"],
    icon: "⚡",
    color: "#059669",
    monaco: "systemverilog",
    ext: "sv",
    piston: null,
    starter: `// SystemVerilog (IEEE 1800)
module top;
  typedef struct {
    int id;
    string name;
  } Packet;

  initial begin
    Packet p;
    p.id = 101;
    p.name = "SmartEducation_DataPkt";
    $display("Hello from SystemVerilog Testbench!");
    $display("Packet ID=%0d Name=%s", p.id, p.name);
    #10;
    $display("Simulation completed at %0t ns", $time);
    $finish;
  end
endmodule
`,
    simulatedOutput: `[SystemVerilog Simulator (VCS / QuestaSim)]
Top level modules: top
Time resolution is 1 ns
Hello from SystemVerilog Testbench!
Packet ID=101 Name=SmartEducation_DataPkt
Simulation completed at 10 ns
$finish at simulation time 10ns
`,
  },
  {
    id: "vhdl",
    label: "VHDL",
    categories: ["Hardware (HDL)"],
    icon: "💡",
    color: "#6366f1",
    monaco: "plaintext",
    ext: "vhd",
    piston: null,
    starter: `-- VHDL (Very High Speed Integrated Circuit HDL)
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity hello_world is
end entity hello_world;

architecture Behavioral of hello_world is
begin
  process
  begin
    report "Hello, World from VHDL!" severity note;
    wait;
  end process;
end architecture Behavioral;
`,
    simulatedOutput: `[GHDL VHDL Simulator 2.0]
ghdl -a hello.vhd
ghdl -e hello_world
ghdl -r hello_world
hello.vhd:13:5:@0ms:(report note): Hello, World from VHDL!
Simulation completed without errors.
`,
  },

  // ==========================================
  // 11. CONFIG / MARKUP
  // ==========================================
  {
    id: "yaml",
    label: "YAML",
    categories: ["Config & Markup"],
    icon: "📄",
    color: "#64748b",
    monaco: "yaml",
    ext: "yaml",
    piston: null,
    starter: `# Smart Education Configuration
app:
  name: "Smart Education Platform"
  version: "2.0.0"
  environment: "production"

database:
  engine: "mysql"
  host: "127.0.0.1"
  port: 3306
  schema: "smart_education"

features:
  quizzes: true
  flashcards: true
  ai_tutor: true
  code_ide:
    supported_languages: 97
    timeout_seconds: 15
`,
    simulatedOutput: `[YAML Validator & Parser]
Status: Valid YAML syntax!
Parsed root keys: ["app", "database", "features"]
Tree depth: 3 levels | Nodes: 12
`,
  },
  {
    id: "json",
    label: "JSON",
    categories: ["Config & Markup", "Web"],
    icon: "📋",
    color: "#10b981",
    monaco: "json",
    ext: "json",
    piston: null,
    starter: `{
  "platform": "Smart Education Platform",
  "version": "2.0",
  "ide": {
    "languagesCount": 97,
    "runtimes": ["Piston Cloud", "Client Emulators"],
    "features": ["Syntax Highlight", "Console", "Stdin", "Themes"]
  },
  "status": "ready"
}
`,
    simulatedOutput: `[JSON Validator]
Status: Valid JSON!
Size: 224 bytes | Keys: 4
Formatted Output:
{
  "platform": "Smart Education Platform",
  "version": "2.0",
  "ide": {
    "languagesCount": 97,
    "runtimes": [
      "Piston Cloud",
      "Client Emulators"
    ],
    "features": [
      "Syntax Highlight",
      "Console",
      "Stdin",
      "Themes"
    ]
  },
  "status": "ready"
}
`,
  },
  {
    id: "xml",
    label: "XML",
    categories: ["Config & Markup", "Web"],
    icon: "📝",
    color: "#f97316",
    monaco: "xml",
    ext: "xml",
    piston: null,
    starter: `<?xml version="1.0" encoding="UTF-8"?>
<school name="Smart Education Institute">
  <departments>
    <department id="cs" name="Computer Science">
      <courses count="24">
        <course code="CS101" credits="4">Data Structures</course>
        <course code="CS202" credits="3">Operating Systems</course>
      </courses>
    </department>
  </departments>
</school>
`,
    simulatedOutput: `[XML Parser (DOM Level 3)]
Status: Well-formed and Valid XML!
Root element: <school> (Attribute: name="Smart Education Institute")
Child nodes: 1 department, 2 courses.
`,
  },
  {
    id: "toml",
    label: "TOML",
    categories: ["Config & Markup"],
    icon: "⚙️",
    color: "#0891b2",
    monaco: "ini",
    ext: "toml",
    piston: null,
    starter: `# TOML Configuration (Tom's Obvious Minimal Language)
[package]
name = "smart-education-ide"
version = "2.0.0"
authors = ["Roshin <roshin@smarteducation.edu>"]
edition = "2026"

[dependencies]
monaco-editor = "^0.45.0"
react = "^18.2.0"

[features]
cloud-run = true
local-preview = true
max-languages = 97
`,
    simulatedOutput: `[TOML v1.0.0 Parser]
Status: Valid TOML syntax!
Tables loaded: [package], [dependencies], [features]
Total key-value pairs: 8
`,
  },
  {
    id: "markdown",
    label: "Markdown",
    categories: ["Config & Markup", "Web"],
    icon: "📘",
    color: "#6b7280",
    monaco: "markdown",
    ext: "md",
    piston: null,
    isLivePreview: true,
    starter: `# 🚀 Smart Education Code IDE

Welcome to the **all-in-one programming studio** supporting over **90+ languages**!

## ✨ Key Features
- **Monaco Editor** — Powered by VS Code's core engine
- **Piston Sandbox** — Instant cloud code execution
- **Categories** — From Mainstream to Systems, JVM, Functional & Esoteric
- **Live HTML/CSS Preview** — Test web components instantly

### Code Sample in Python
\`\`\`python
def greet(user):
    return f"Hello, {user}!"
\`\`\`

> *“Education is not the learning of facts, but the training of the mind to think.”* — Albert Einstein
`,
  },

  // ==========================================
  // 12. ESOTERIC / JOKE LANGUAGES
  // ==========================================
  {
    id: "brainfuck",
    label: "Brainfuck",
    categories: ["Esoteric"],
    icon: "🧠",
    color: "#ef4444",
    monaco: "plaintext",
    ext: "bf",
    piston: { language: "brainfuck", version: "2.7.3" },
    starter: `[ Brainfuck: Prints "Hello, World!" ]
>++++++++[<+++++++++>-]<.>++++[<+++++++>-]<+.+++++++..+++.>>++++++[<+++++++>-]<++.------------.>++++++[<+++++++++>-]<+.<.+++.------.--------.>>>++++[<++++++++>-]<+.
`,
  },
  {
    id: "whitespace",
    label: "Whitespace",
    categories: ["Esoteric"],
    icon: "␣",
    color: "#94a3b8",
    monaco: "plaintext",
    ext: "ws",
    piston: null,
    starter: `   	
   	 
   	 	
   	  
[ Whitespace: Program consisting solely of spaces, tabs, and linefeeds ]
`,
    simulatedOutput: `[Whitespace Virtual Machine]
Stack initialized.
Reading instruction stream (Spaces, Tabs, Linefeeds)...
Output:
Hello, World!
Stack: empty. Program finished.
`,
  },
  {
    id: "malbolge",
    label: "Malbolge",
    categories: ["Esoteric"],
    icon: "🔥",
    color: "#b91c1c",
    monaco: "plaintext",
    ext: "mal",
    piston: null,
    starter: `(=<` + "`#9]~6ZY32Vx/4Rs+0No-&Jk)" + `Et规模
`,
    simulatedOutput: `[Malbolge Virtual Machine - Designed to be impossible to program]
Initializing ternary memory registers (A, C, D)...
Executing self-encrypting opcodes...
HELLO WORLD
Execution terminated after 412 cyphered cycles.
`,
  },
  {
    id: "lolcode",
    label: "LOLCODE",
    categories: ["Esoteric"],
    icon: "😸",
    color: "#f59e0b",
    monaco: "plaintext",
    ext: "lol",
    piston: { language: "lolcode", version: "0.11.2" },
    starter: `HAI 1.4
  CAN HAS STDIO?
  VISIBLE "HAI WORLD! SMART EDUCATION IS TEH BEST!"
  I HAS A NUM ITZ 5
  VISIBLE "NUM IS " NUM
KTHXBYE
`,
  },
  {
    id: "befunge",
    label: "Befunge",
    categories: ["Esoteric"],
    icon: "🌀",
    color: "#8b5cf6",
    monaco: "plaintext",
    ext: "bf",
    piston: { language: "befunge93", version: "0.2.0" },
    starter: `64+"!dlroW ,olleH">:v
                 |,<
                 @
`,
  },

  // ==========================================
  // 13. GAME / ENGINE-SPECIFIC
  // ==========================================
  {
    id: "gdscript",
    label: "GDScript (Godot)",
    categories: ["Game Dev", "Scripting"],
    icon: "🤖",
    color: "#478cbf",
    monaco: "python",
    ext: "gd",
    piston: null,
    starter: `# GDScript (Godot Engine 4)
extends Node2D

@export var speed: float = 300.0
var score: int = 0

func _ready() -> void:
    print("Hello from Godot Engine GDScript!")
    print("Node initialized at position: ", position)

func add_score(points: int) -> void:
    score += points
    print("Score updated: ", score)
`,
    simulatedOutput: `--- Godot Engine v4.2.stable ---
[Node2D:1042] Hello from Godot Engine GDScript!
[Node2D:1042] Node initialized at position: (0, 0)
[Node2D:1042] Score updated: 100
Frame 0 loaded. Engine running at 60 FPS.
`,
  },
  {
    id: "unrealscript",
    label: "UnrealScript",
    categories: ["Game Dev"],
    icon: "🎮",
    color: "#1e293b",
    monaco: "cpp",
    ext: "uc",
    piston: null,
    starter: `// UnrealScript (Unreal Engine)
class SmartPlayerController extends PlayerController;

var int PlayerScore;

event PostBeginPlay()
{
    super.PostBeginPlay();
    ` + "`" + `log("Hello, World from UnrealScript!");
    ClientMessage("Welcome to the Smart Education Arena!");
}
`,
    simulatedOutput: `[Unreal Engine Script Compiler]
Parsing SmartPlayerController.uc...
Compiling class SmartPlayerController -> Success.
ScriptLog: Hello, World from UnrealScript!
ClientMessage: Welcome to the Smart Education Arena!
`,
  },
  {
    id: "shaders",
    label: "HLSL / GLSL (Shaders)",
    categories: ["Game Dev"],
    icon: "🌈",
    color: "#ec4899",
    monaco: "c",
    ext: "glsl",
    piston: null,
    starter: `// GLSL Fragment Shader
#version 330 core
out vec4 FragColor;

in vec2 TexCoords;
uniform float u_time;

void main() {
    // Generate an animated vibrant gradient
    vec3 color = 0.5 + 0.5 * cos(u_time + TexCoords.xyx + vec3(0.0, 2.0, 4.0));
    FragColor = vec4(color, 1.0);
}
`,
    simulatedOutput: `[OpenGL / Direct3D Shader Compiler]
Fragment Shader Compilation: SUCCESS
Vertex Attributes bound: 1 (TexCoords)
Uniforms active: 1 (u_time: float)
Output color targets: 1 (FragColor: vec4)
Pipeline linked successfully without warnings.
`,
  },

  // ==========================================
  // 14. OTHER NOTABLE
  // ==========================================
  {
    id: "prolog",
    label: "Prolog",
    categories: ["Other Notable", "Logic"],
    icon: "🧠",
    color: "#7c3aed",
    monaco: "prolog",
    ext: "pl",
    piston: { language: "prolog", version: "8.2.4" },
    starter: `% Prolog
parent(john, mary).
parent(john, tom).
parent(mary, ann).

grandparent(X, Z) :- parent(X, Y), parent(Y, Z).

:- initialization(main).
main :-
    write('Hello, World from Prolog!'), nl,
    findall(G, grandparent(john, G), Grandchildren),
    format('John\'s grandchildren: ~w~n', [Grandchildren]).
`,
  },
  {
    id: "apl",
    label: "APL",
    categories: ["Other Notable"],
    icon: "⍺",
    color: "#8b5cf6",
    monaco: "plaintext",
    ext: "apl",
    piston: { language: "bqn", version: "1.0.0" },
    starter: `# APL / BQN Array Programming
•Out "Hello, World from Array Programming!"
# Calculate sum of squares of 1..10
+´ 2⋆˜ 1+↕10
`,
  },
  {
    id: "j",
    label: "J",
    categories: ["Other Notable"],
    icon: "⚡",
    color: "#0284c7",
    monaco: "plaintext",
    ext: "ijs",
    piston: null,
    starter: `NB. J Programming Language
echo 'Hello, World from J!'

NB. Average of an array: (+/ % #)
avg =: +/ % #
echo 'Mean of 10 20 30 40 50:'
echo avg 10 20 30 40 50
`,
    simulatedOutput: `Hello, World from J!
Mean of 10 20 30 40 50:
30
`,
  },
  {
    id: "crystal",
    label: "Crystal",
    categories: ["Other Notable", "Systems"],
    icon: "💎",
    color: "#06b6d4",
    monaco: "ruby",
    ext: "cr",
    piston: { language: "crystal", version: "0.36.1" },
    starter: `# Crystal (Fast as C, slick as Ruby)
puts "Hello, World from Crystal!"

fibs = (1..10).map { |n| n ** 2 }
puts "Squares: #{fibs}"
`,
  },
  {
    id: "solidity",
    label: "Solidity",
    categories: ["Other Notable", "Web"],
    icon: "⛓️",
    color: "#64748b",
    monaco: "sol",
    ext: "sol",
    piston: null,
    starter: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StudentRegistry {
    string public institution = "Smart Education";
    mapping(address => uint256) public grades;

    event GradeRecorded(address indexed student, uint256 grade);

    function recordGrade(address _student, uint256 _grade) external {
        require(_grade <= 100, "Grade cannot exceed 100");
        grades[_student] = _grade;
        emit GradeRecorded(_student, _grade);
    }
}
`,
    simulatedOutput: `[Solidity solc compiler v0.8.20+commit.a1b79de6]
Compiling StudentRegistry.sol...
Bytecode size: 542 bytes
Estimated deployment gas: 114,200 gas
Contract ABI generated:
- institution() view returns (string)
- grades(address) view returns (uint256)
- recordGrade(address, uint256)
Contract compiled cleanly with 0 errors.
`,
  },
  {
    id: "vala",
    label: "Vala",
    categories: ["Other Notable", "Systems"],
    icon: "🍇",
    color: "#7c3aed",
    monaco: "c",
    ext: "vala",
    piston: null,
    starter: `// Vala (GNOME / GObject)
int main(string[] args) {
    stdout.printf("Hello, World from Vala!\\n");
    var list = new Gee.ArrayList<string>();
    list.add("GNOME");
    list.add("GTK4");
    list.add("Vala");
    foreach (var item in list) {
        stdout.printf("• %s\\n", item);
    }
    return 0;
}
`,
    simulatedOutput: `[Vala Compiler (valac)]
Compiling to C with GObject introspection...
gcc -o main main.c $(pkg-config --cflags --libs glib-2.0 gee-0.8)
Hello, World from Vala!
• GNOME
• GTK4
• Vala
`,
  },
  {
    id: "actionscript",
    label: "ActionScript 3",
    categories: ["Other Notable", "Web"],
    icon: "⚡",
    color: "#ef4444",
    monaco: "javascript",
    ext: "as",
    piston: null,
    starter: `package {
    import flash.display.Sprite;
    import flash.text.TextField;

    public class Main extends Sprite {
        public function Main() {
            trace("Hello, World from ActionScript 3.0!");
            var tf:TextField = new TextField();
            tf.text = "Smart Education Flash Runtime";
            addChild(tf);
        }
    }
}
`,
    simulatedOutput: `[Adobe AIR / ActionScript 3.0 MXMLC Compiler]
Main.as(10): Info: Compiling SWF bytecode...
[trace] Hello, World from ActionScript 3.0!
DisplayObject hierarchy initialized: Main -> TextField("Smart Education Flash Runtime")
SWF Stage initialized at 60fps.
`,
  },
];
