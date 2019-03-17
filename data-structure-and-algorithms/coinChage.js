// You have an infinite amount of K different denominations of coins.
// Find the minimum number of coins to possess a value of N dollars.
// example: K=3, denominations = {1, 3, 4} and N = 10

// Notes:
// A greedy algorithm of selecting the largest available denomination under N at every instant won’t give optimal answers.
// Example: The test case: K=3, denominations = {1, 3, 4} and N = 10.
// The greedy answer yields 4 coins (4 + 4 + 1 + 1) while the optimal answer is 3 coins (4 + 3 + 3).

// Thus, clearly we need to check all possible coin selections we can make
// TODO: https://blogarithms.github.io/articles/2019-03/cracking-dp-part-one
