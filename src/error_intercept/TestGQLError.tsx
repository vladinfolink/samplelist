// src/components/TestGQLError.tsx
import { gql, useMutation, useQuery } from '@apollo/client';

// Test query that will fail due to invalid field
const TEST_QUERY = gql`
  query TestError {
    nonexistentField
    willCauseError @directive(willFail: true)
  }
`;

// Test mutation that will fail
const TEST_MUTATION = gql`
  mutation TestMutationError {
    updateNonexistent(id: "123") {
      field
    }
  }
`;

export const TestGQLError = () => {
  const { refetch } = useQuery(TEST_QUERY, {
    skip: true // Don't execute on component mount
  });

  const [triggerMutation] = useMutation(TEST_MUTATION);

  const handleQueryError = async () => {
    try {
      await refetch();
    } catch (error) {
      console.log('Query error caught in component:', error);
    }
  };

  const handleMutationError = async () => {
    try {
      await triggerMutation();
    } catch (error) {
      console.log('Mutation error caught in component:', error);
    }
  };

  return (
    <div className="space-x-4">
      <button
        onClick={handleQueryError}
        className="px-4 py-2 bg-yellow-500 text-white rounded"
      >
        Trigger GQL Query Error
      </button>

      <button
        onClick={handleMutationError}
        className="px-4 py-2 bg-orange-500 text-white rounded"
      >
        Trigger GQL Mutation Error
      </button>
    </div>
  );
};