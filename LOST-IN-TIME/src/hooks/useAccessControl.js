import { useAccessControlContext } from '../context/AccessControlContext';

export function useAccessControl() {
  return useAccessControlContext();
}

export default useAccessControl;
