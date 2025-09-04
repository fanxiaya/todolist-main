const todoSchema = {
  title: {
    notEmpty: {
      errorMessage: "title 不能为空",
    },
    trim: true,
    isLength: {
      options: { min: 1, max: 200 },
      errorMessage: "title 长度必须在 1-200 之间",
    },
  },
  description: {
    optional: true,
    trim: true,
    isLength: {
      options: { max: 500 },
      errorMessage: "description 不能超过 500 字符",
    },
  },
  completed: {
    optional: true,
    isBoolean: {
      errorMessage: "completed 必须为布尔值",
    },
    default: false,
  },
  updateAt: {
    optional: true,
    custom: {
      options: (value) => {
        return (
          Object.prototype.toString.call(value) === "[object Date]" &&
          !isNaN(value)
        );
      },
      errorMessage: "updateAt 必须为有效的 Date 对象",
    },
    default: () => new Date(),
  },
};
export default todoSchema;
