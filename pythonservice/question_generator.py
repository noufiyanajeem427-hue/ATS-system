def generate_questions(skills):

    question_bank = {

        "Python": [
            "What are Python decorators?",
            "Explain list comprehension.",
            "What is the difference between a list and a tuple?"
        ],

        "Java": [
            "Explain JVM, JRE and JDK.",
            "What is polymorphism?",
            "Explain method overloading."
        ],

        "JavaScript": [
            "What is event bubbling?",
            "Explain closures.",
            "Difference between var, let and const?"
        ],

        "React": [
            "What are React Hooks?",
            "Difference between useState and useEffect?",
            "Explain Virtual DOM."
        ],

        "Node.js": [
            "What is Express?",
            "Explain middleware.",
            "What is asynchronous programming?"
        ],

        "MongoDB": [
            "Difference between SQL and MongoDB?",
            "What are collections?",
            "Explain indexing."
        ],

        "SQL": [
            "Difference between DELETE, DROP and TRUNCATE?",
            "What are joins?",
            "Explain normalization."
        ],

        "Machine Learning": [
            "What is overfitting?",
            "Difference between supervised and unsupervised learning?",
            "Explain cross validation."
        ]
    }

    questions = []

    for skill in skills:

        if skill in question_bank:
            questions.extend(question_bank[skill])

    return questions