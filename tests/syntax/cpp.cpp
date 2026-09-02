#include <memory>
#include <string>
#include <vector>

namespace ava::night {

template <typename T>
class Box {
public:
    explicit Box(T value) : value_(std::move(value)) {}
    const T& get() const { return value_; }
private:
    T value_;
};

struct User {
    int id{};
    std::string name;
};

constexpr auto make_name() -> const char* { return "Ava Night"; }

int main() {
    auto user = std::make_unique<User>(User{42, make_name()});
    std::vector<int> values{1, 2, 3, 4};
    auto doubled = [&values]() {
        for (auto& value : values) value *= 2;
    };
    doubled();
    return user->id > 0 ? 0 : 1;
}

} // namespace ava::night