import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false, speed: 300, minimum: 0.1 });

interface TopProgressBarProps {
  loading: boolean;
}

const TopProgressBar = ({ loading }: TopProgressBarProps) => {
  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
    return () => {
      NProgress.done();
    };
  }, [loading]);

  return null;
};

export default TopProgressBar;