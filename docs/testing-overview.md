✘ akshatk@Akshats-MacBook-Pro  ~/Coding/CSC307-Final/NodeDemons   feature/adding-multiple-features ±
➜ npm test -- --coverage

> nodedemons@1.0.0 test
> jest --coverage

PASS packages/react-frontend/src/tests/SearchBar.test.js
PASS packages/react-frontend/src/tests/filterRides.test.js
------------------------|---------|----------|---------|---------|-------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------|---------|----------|---------|---------|-------------------
All files | 92.22 | 91.07 | 92.85 | 92.04 |  
 .../react-frontend/src | 91.66 | 100 | 85.71 | 91.17 |  
 SearchBar.jsx | 91.66 | 100 | 85.71 | 91.17 | 22,32,68  
 ...-frontend/src/utils | 92.45 | 89.79 | 100 | 92.45 |  
 filterCities.jsx | 100 | 100 | 100 | 100 |  
 filterRides.js | 91.83 | 89.79 | 100 | 91.83 | 15,36,83,96  
 test | 100 | 100 | 100 | 100 |  
 styleMock.js | 100 | 100 | 100 | 100 |  
------------------------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests: 8 passed, 8 total
Snapshots: 0 total
Time: 0.676 s, estimated 1 s
Ran all test suites.

Our SearchBar contains 4 fields/states. We have over 80% coverage in it. To introduce myself to understanding how testing works, I wrote tests for filterRides too, which also got over 80% coverage in it.
