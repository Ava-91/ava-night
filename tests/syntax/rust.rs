use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct User<'a, T> {
    pub id: u64,
    pub name: &'a str,
    pub metadata: T,
}

pub trait Cache<T> {
    fn insert(&mut self, key: String, value: T);
    fn get(&self, key: &str) -> Option<&T>;
}

pub enum ResultState<T> {
    Ready(T),
    Failed { message: String, code: u16 },
}

impl<T> Cache<T> for HashMap<String, T> {
    fn insert(&mut self, key: String, value: T) { HashMap::insert(self, key, value); }
    fn get(&self, key: &str) -> Option<&T> { HashMap::get(self, key) }
}

macro_rules! theme_name {
    () => { "Ava Night" };
}

async fn load_user<'a>(id: u64) -> ResultState<User<'a, Vec<String>>> {
    if id == 0 {
        return ResultState::Failed { message: "missing id".into(), code: 400 };
    }
    ResultState::Ready(User { id, name: "Ava", metadata: vec![theme_name!().into()] })
}