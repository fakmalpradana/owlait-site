import { Bg, Button } from '@/components';

export function NotFound() {
  return (
    <>
      <Bg />
      <section className="hero">
        <div className="wrap">
          <h1><span className="grad">404</span></h1>
          <p className="lead muted">This page flew away.</p>
          <Button href="/" variant="primary">Back home</Button>
        </div>
      </section>
    </>
  );
}
