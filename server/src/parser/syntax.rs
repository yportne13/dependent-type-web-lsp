use crate::{list::List, parser_lib::{Span, ToSpan}, typort::empty_span};

#[derive(Clone, Debug, Copy, PartialEq)]
pub enum Icit {
    Impl,
    Expl,
}

#[derive(Clone, Debug, PartialEq)]
pub enum Either {
    Name(Span<String>),
    Icit(Icit),
}

#[derive(Clone, Debug, PartialEq)]
pub enum Pattern {
    Any(Span<()>),
    Con(Span<String>, Vec<Pattern>),
}

impl Pattern {
    pub fn count_binders(&self) -> u32 {
        match self {
            Pattern::Any(_) => 0, // 假设 Any 绑定一个变量
            Pattern::Con(_, pats) => pats.iter().map(|p| p.count_binders()).sum(),
            // 如果有 Pattern::Var, 也是返回 1
        }
    }
}

#[derive(Clone, Debug)]
pub enum Raw {
    Var(Span<String>),
    Obj(Box<Raw>, Span<String>),
    Lam(Span<String>, Either, Box<Raw>),
    App(Box<Raw>, Box<Raw>, Either),
    U(u32),
    Pi(Span<String>, Icit, Box<Raw>, Box<Raw>),
    Let(Span<String>, Box<Raw>, Box<Raw>, Box<Raw>),
    Hole,
    LiteralIntro(Span<String>),
    Match(Box<Raw>, Vec<(Pattern, Raw)>),
    Sum(Span<String>, Vec<Raw>, Vec<(Span<String>, Vec<Raw>)>),
    SumCase {
        sum_name: Span<String>,
        params: Vec<Raw>,
        cases: Vec<(Span<String>, Vec<Raw>)>,
        case_name: Span<String>,
        datas: Vec<Raw>,
    },
    StructType(Span<String>, Vec<Raw>, Vec<(Span<String>, Raw)>),
    StructData(Span<String>, Vec<Raw>, Vec<(Span<String>, Raw)>),
}

impl Raw {
    pub fn to_span(&self) -> Span<()> {
        match self {
            Raw::Var(span) => span.to_span(),
            Raw::Obj(raw, span) => raw.to_span() + span.to_span(),
            Raw::Lam(span, _, raw) => span.to_span() + raw.to_span(),
            Raw::App(raw, raw1, either) => raw.to_span() + match either {
                Either::Name(span) => span.to_span(),
                Either::Icit(_) => raw1.to_span(),
            },
            Raw::U(_) => empty_span(()),//TODO:
            Raw::Pi(span, _, _, raw1) => span.to_span() + raw1.to_span(),
            Raw::Let(span, _, _, raw2) => span.to_span() + raw2.to_span(),
            Raw::Hole => empty_span(()),//TODO:
            Raw::LiteralIntro(span) => span.to_span(),
            Raw::Match(raw, items) => items.last()
                .map(|x| raw.to_span() + x.1.to_span())
                .unwrap_or(raw.to_span()),
            Raw::Sum(span, raws, items) => items.last()
                .map(|x| span.to_span() + x.1.last().map(|x| x.to_span()).unwrap_or(x.0.to_span()))
                .unwrap_or(raws.last().map(|x| span.to_span() + x.to_span()).unwrap_or(span.to_span())),
            Raw::SumCase { sum_name, params, cases, case_name, datas } => datas.last()
                .map(|x| case_name.to_span() + x.to_span())
                .unwrap_or(case_name.to_span()),
            Raw::StructType(span, raws, items) | Raw::StructData(span, raws, items) => items.last()
                .map(|x| span.to_span() + x.1.to_span())
                .unwrap_or(
                    raws
                        .last()
                        .map(|x| span.to_span() + x.to_span())
                        .unwrap_or(span.to_span())
                )
        }
    }
}

#[derive(Clone, Debug)]
pub enum Decl {
    Def {
        name: Span<String>,
        params: Vec<(Span<String>, Raw, Icit)>,
        ret_type: Raw,
        body: Raw,
    },
    Println(Raw),
    Enum {
        name: Span<String>,
        params: Vec<(Span<String>, Raw, Icit)>,
        cases: Vec<(Span<String>, Vec<Raw>)>,
    },
    Struct {
        name: Span<String>,
        params: Vec<(Span<String>, Raw, Icit)>,
        fields: Vec<(Span<String>, Raw)>,
    },
}
