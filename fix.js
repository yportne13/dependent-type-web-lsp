const fs = require('fs');
const content = fs.readFileSync('sample/myExt/extension.js', 'utf-8');
const marker = '(e.nrsFile =';
const start = content.indexOf(marker);
const tickStart = content.indexOf('`', start) + 1;
const tickEnd = content.indexOf('`\n          )', tickStart);

console.log(`Old nrsFile: ${tickEnd - tickStart} chars`);

const newExample = `
// Typort language demo -- demo using prelude types (Nat, Boolean, List, Eq)

// Basic operations
def mynot(x: Boolean): Boolean = x.not
println (mynot false)

// Nat arithmetic using prelude's + and *
def two = succ (succ zero)
def four = 2 + 2
println four

def multiply(x: Nat, y: Nat): Nat = x * y
println (multiply four two)

// Lists using prelude's List with lnil/lcons
def listid[T](x: List[T]): List[T] = x
def someBools: List[Boolean] = lcons true (lcons false lnil)
println (listid someBools)

// Higher-kinded types
def test0: Type 1 = Type 0
def test1: Type 2 = Type 1 -> Type 0
enum HList[A] {
    hnil
    hcons(x: A, tail: HList[A])
}
def hl1: HList[Nat] = hcons zero (hcons two hnil)

// Leibniz equality
def Eq1[A](x: A, y: A): Type 1 = (P: A -> Type 0) -> P x -> P y
def refl1[A, x: A]: Eq1[A] x x = _ => px => px

// Struct with size constraints
struct MySig {
    name: String
    size: Nat
}
def sameSize(a: MySig, b: MySig)(eq: Eq1[Nat] a.size b.size): String =
    string_concat a.name b.name
def sigA = new MySig("A", four)
def sigB = new MySig("B", four)
def sigC = new MySig("C", two)
def ab = sameSize sigA sigB refl1
println ab

// Custom lemmas
def add_succ_zero_left(k: Nat): Eq (1 + k) (succ k) =
    cong_succ (add_zero_right k)

def mul_one_right(n: Nat): Eq[Nat] (n * 1) n =
    match n {
        case zero => rfl[Nat][zero]
        case succ(k) =>
            let ih = mul_one_right k;
            let lemma: Eq[Nat] (1 + k) (succ k) = cong_succ (add_zero_right k);
            trans(cong(add 1, ih), lemma)
    }

// Dependent pair
struct DepPair[A: Type 0, P: A -> Type 0] {
    fst: A
    snd: P fst
}
def ex_even: DepPair[Nat][x => Eq (x % 2) 0] =
    DepPair.mk[Nat][x => Eq (x % 2) 0] four rfl
`;

const result = content.substring(0, tickStart) + newExample + content.substring(tickEnd);
fs.writeFileSync('sample/myExt/extension.js', result);
console.log(`Written ${result.length} bytes`);
