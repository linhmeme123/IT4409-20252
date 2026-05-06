function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = { message: "Hello, World!" };
            resolve(data);
        }, 1000);
    });
}

async function loadWithAwait() {
    console.log("Before await");
    const data = await fetchData();
    console.log("After await", data);
}

loadWithAwait();
console.log("This log runs first");

function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = { message: "Hello, World!" };
            resolve(data);
        }, 1000);
    });
}

async function loadWithoutAwait() {
    console.log("Before await");
    const data = fetchData();
    console.log("After await", data);
}

loadWithoutAwait();
console.log("This log runs first");