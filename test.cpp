#include <iostream>
#include <vector>

class Solution {
public:
    long long solve(int N, std::vector<int>& A) {
        long long count = 0;
        
        // We need at least 4 elements to form a valid subsequence
        if (N < 4) return 0;
        
        // For each possible combination of four positions
        for (int p = 0; p < N-3; p++) {
            for (int q = p+1; q < N-2; q++) {
                for (int r = q+1; r < N-1; r++) {
                    // Use multiplication property to optimize the innermost loop
                    // We only need to check positions after r where A[s] = (A[p] * A[r]) / A[q]
                    long long target = (1LL * A[p] * A[r]);
                    if (target % A[q] != 0) continue;
                    target = target / A[q];
                    
                    // Count all valid s positions
                    for (int s = r+1; s < N; s++) {
                        if (A[s] == target) {
                            count++;
                        }
                    }
                }
            }
        }
        
        return count;
    }
};

// Example usage
int main() {
    std::vector<int> A = {2, 1, 3, 6, 8, 4};
    int N = A.size();
    
    Solution solution;
    long long result = solution.solve(N, A);
    
    std::cout << "Number of valid subsequences: " << result << std::endl;
    
    return 0;
}