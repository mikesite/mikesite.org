/*
Source:
http://pegjs.org/online

Grammar:
Filter = _ f:Or _ {return 'return '+f+';';} / _ {return 'return true;';}
Or = h:And t:(_ ('|' '|'? / 'OR'i) _ And)* {return t.reduce((t,e) => t+'||'+e[3],h);}
And = h:Xor t:(_ ('&' '&'? / 'AND'i) _ Xor)* {return t.reduce((t,e) => t+'&&'+e[3],h);}
Xor = l:Not _ ('^' / 'XOR'i) _ r:Not {return l+'!='+r;} / Not
Not = ('!' / 'NOT'i) _ f:Not {return '!'+f;} / Group
Group = '(' _ f:Or _ ')' {return '('+f+')';} / Rule
Rule = tRule / nRule / rRule / rcRule / bRule
tRule = '[' f:Field? ']' _ n:[=!]e:[=~] _ v:tVal {return 't(o,'+f+','+v+','+(n=='=')+','+(e=='=')+')';}
tVal = v:String / b:bID {return 'i['+b+']';}
nRule = '{' f:Field '}' _ c:nComp _ v:nVal {return 'n(o,'+f+','+v+','+c+')';}
nComp = n:[!=]'=' {return '[true,'+(n=='=')+']';} / c:[<>]e:'='? {return '[false,'+(!!e)+','+(c=='<')+']';}
nVal = v:Int / b:bID {return 'parseInt(i['+b+'])';}
rRule = '<' _ q:Quantifier _ '>' _ p:rPred {return 'r(o,e,i,"+switch",'+q+',function(o,e,i){return '+p+';})';}
rPred = Group / '(' _ ')' {return 'true';}
Quantifier = '!' {return '[0]';} / '?' {return '[1]';}
	/ l:sNat _ '~' _ u:sNat {return '[2,'+l+','+u+']';}
	/ p:sNat _ t:[+-]? {return '[3,'+p+','+(t?(t=='+'?1:-1):0)+']';}
rcRule = '>' _ q: Quantifier _ '<' _ p:Group {return 'r(o,e,i,"allC",'+q+',function(o,e,i){return '+p+';})';}
bRule = b:Binds _ '~>' _ p:Group {return 'b(o,e,i,'+b+',function(o,e,i){return '+p+';})'}
Binds = '@@(' _ b:(Bind _)+ ')' {return '['+b.map((e) => e[0]).join(',')+']';} / b:Bind {return '['+b+']';}
Bind = '@' f:Field b:bID {return '['+b+','+f+']';}
bID "bind/bound id" = '#' b:Nat {return b;}
Nat "natural number" = [0-9]+ {return parseInt(text(),10);}
sNat "signed natural number" = n:'-'? v:Nat {return '['+v+','+!n+']';}
Int "integer" = '-'? Nat {return parseInt(text(),10);}
Field "field name" = [a-zA-Z0-9_ ]+ {return '"'+text()+'"';}
String "string" = '"' [^\\"]* '"' {return text();}
_ "spaces" = [ \t\n\r]*

Context (BORNITE-Definition):
"[B]ind" - binds a field's value to a numeric key (similar to a functional let-construct)
"[O]bject" - the current object that the predicate judges upon
"[R]ebase" - moves the focus from the current object to some associated properties of the object
"[N]umerical" - executes a numerical check on a field of the current object
"[I]ndexed Bindings" - the current bindings that the checks may compare to
"[T]extual" - executes a textual check on a field or all fields of the current object
"[E]xtractors" - the current extractors that associate the current object to its properties

Meta-variables:
"[O]bject":
    type: CsvItem, offers a 'get'-method with a Index<string>-like signature
"[I]ndexed Bindings":
    type: string[], number-based indices, values may represent numerical information
"[E]xtractors":
    type: Array<Index<(CsvItem) -> CsvItem[]>>, length > 0, the first will be applied first,
        the index' first char determines if and what rotation is applied to the extractors after use (-, [else], +)
        each Extractor defines several ways of extraction

Functions:
"[B]ind"
    operates on "O", "I" and "E"
    further arguments: b, p
    - b [number, string][]: the new bindings that should be remembered, if an index is already used the bind-function may overwrite the previous value for its scope
    - p (("O", "E", "I") => boolean): the predicate to apply
    return type: boolean
"[R]ebase"
    operates on "O", "I" and "E"
    further arguments: s, q, p
    - c (string): choice of extraction, which extractor function to apply, first char determines extractor rotation
    - q (number[]): quantity parameters
        for q[0]==0: match all
        for q[0]==1: match any
        for q[0]==2: match range, q[1][0] and q[2][0] (number) are the limits (1: lower, 2: upper), q[1][1] and q[2][1] (boolean) indicate if the limits are positive or zero
        for q[0]==3: match pivot, q[1][0] (number) is the pivot element, q[1][1] (boolean) indicate if the pivot is positive or zero, q[2] (number) indicate a trend
            trend==0 - only exact match, trend<0 - include smaller quantities, trend>0 - include larger quantities
    - p (("O", "E", "I") => boolean): the predicate to apply
    return type: boolean
"[N]umerical"
    operates on "O"
    further arguments: f, v, c
    - f (string): field to check
    - v (number): expected value
    - c (boolean[]): further compare parameter
        for c[0]==true: exact match; c[1] expresses whether the match is a positive or negative match
        for c[0]==false: lt/gt match; c[1] expresses if exact is in the accepted range, c[2] expresses if the field should be smaller than the given value
    return type: boolean
"[T]extual"
    operates on "O"
    further arguments: f, v, n, e
    - f (string | null): field to check
    - v (string): expected value
    - n (boolean): positive or negative match
    - e (boolean): exact match
    return type: boolean

Functions operating on meta-variables have to accept them as arguments
otherwise it would be impossible to refer to the latest definition of them or update/change/modify them.

Download Options:
- unchanged parser variable
- no results cache
- (!) Optimize: Code Size

Necessary Edits:
- Add RequireJs-Wrapper
 */
/**
 * Declares a parser for csv-based queries.
 * @param {string} query A query that should comply to the given grammar.
 * @returns {string} A predicate for csv-based data types in the form of an eval-compliant string.
 */
export declare function parse(query: string): string
