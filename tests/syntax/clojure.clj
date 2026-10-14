(ns ava-night.core)

(defn greet [{:keys [name active]}]
  (let [message (str "Hello, " name)]
    (if active message "Inactive")))
