const emailRegx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

export const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const validateEmail = (s) => {
    return emailRegx.test(s);
}
