export class Article {
    constructor({ title, content, writer, likeCount, image, createdAt }) {
        this.title = title;
        this.content = content;
        this.writer = writer;
        this.likeCount = likeCount;
        this.image = image;
        this.createdAt = new Date();
    }

    like() {
        this.likeCount++;
    }
}

const url = new URL('https://panda-market-api-crud.vercel.app/articles');

export const getArticleList = (queryParams = { page: 1, pageSize: 10, keyword: '' }) => {
    return fetch(`${url}?${queryParams}`)
        .then((res) => {
            return res.json();
        })
        .catch((error) => {
            console.log(error);
        });
};

export const getArticle = (id) => {
    fetch(`${url}/${id}`)
        .then((res) => {
            return res.json();
        })
        .then((body) => {
            console.log(body);
        })
        .catch((error) => {
            console.log(error);
        });
};

export const createArticle = ({ title, content, image }) => {
    const articleData = { title, content, image };
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(articleData),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Article creation failed');
            }
            return res.json();
        })
        .then((body) => {
            console.log(body);
            return body.id;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

export const patchArticle = (id, updatedData) => {
    return fetch(`${url}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedData),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Article update failed');
            }
            return res.json();
        })
        .then((body) => {
            return body;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

export const deleteArticle = (id) => {
    return fetch(`${url}/${id}`, {
        method: 'DELETE',
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Article deletion failed');
            }
            return res.json();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};
