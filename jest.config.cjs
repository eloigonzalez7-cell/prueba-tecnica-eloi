/** @type {import('jest').Config} */
module.exports = {
  rootDir: __dirname,
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  clearMocks: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "CommonJS",
          moduleResolution: "nodenext",
          jsx: "react-jsx",
          esModuleInterop: true,
          isolatedModules: true,
          strict: true,
          types: ["jest", "node"],
          paths: {
            "@/*": ["./src/*"],
          },
        },
      },
    ],
  },
};
