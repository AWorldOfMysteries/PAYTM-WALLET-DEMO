#include <iostream>
#include <vector>
#include <unordered_map>

class Solution {
public:
    long long solve(int N, std::vector<int>& A) {
        if (N < 4) return 0;
        long long count = 0;
        
        // For each possible q and r combination
        for (int q = 1; q < N-2; q++) {
            // Create frequency map for all possible values before q
            std::unordered_map<long long, int> left_products;
            for (int p = 0; p < q; p++) {
                left_products[A[p]]++;
            }
            
            // For each r after q
            for (int r = q+1; r < N-1; r++) {
                // Count valid s values after r
                for (int s = r+1; s < N; s++) {
                    // Check if there exists a p that satisfies A[p]*A[r] = A[q]*A[s]
                    // Rearranging: A[p] = (A[q]*A[s])/A[r]
                    if (A[r] != 0) {  // Handle division by zero
                        long long required_p = 1LL * A[q] * A[s];
                        if (required_p % A[r] == 0) {
                            required_p = required_p / A[r];
                            // Add the frequency of required_p to our count
                            count += left_products[required_p];
                        }
                    }
                }
            }
        }
        
        return count;
    }
};

// Driver code for testing
int main() {
    std::vector<int> A = {2, 1, 3, 6, 8, 4};
    int N = A.size();
    
    Solution solution;
    long long result = solution.solve(N, A);
    
    std::cout << "Number of valid subsequences: " << result << std::endl;
    
    // Additional test case
    std::vector<int> B = {1, 1, 2, 2, 1};
    result = solution.solve(B.size(), B);
    std::cout << "Test case 2 result: " << result << std::endl;
    
    return 0;
}