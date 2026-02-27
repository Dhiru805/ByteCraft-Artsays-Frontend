// import React from 'react';

// const Page404 = () => {
//   return (
//     <section className="page_404 py-5 bg-white " style={{ fontFamily: "'Arvo', serif" }}>
//       <div className="container">
//         <div className="row justify-content-center">
//           <div className="col-sm-10 text-center">
//             <div
//               className="four_zero_four_bg mb-4"
//               style={{
//                 backgroundImage: 'url("/DashboardAssets/assets/images/Error/404.gif")',
//                 height: '500px',
//                 backgroundPosition: 'center',
//                 backgroundRepeat: 'no-repeat',
//                 backgroundSize: 'cover',
//               }}
//             >
//               <h1 className="display-1">404</h1>
//             </div>

//             <div className="contant_box_404 mt-n5">
//               <h3 className="h1">Looks like you're lost</h3>
//               <p>The page you are looking for is not available!</p>
//               <button className="btn btn-success mt-3" onClick={() => window.history.back()}>
//                 Go Back
//               </button>

//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Page404;


import React from 'react';

const Page404 = () => {
  const styles = {
    wrapper: {
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #ffffff 0%, #eef2f7 100%)',
      fontFamily: "'Inter', system-ui, sans-serif",
      overflow: 'hidden'
    },
    errorCode: {
      fontSize: 'clamp(10rem, 20vw, 15rem)',
      fontWeight: '900',
      margin: '0',
      lineHeight: '1',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      position: 'absolute',
      zIndex: '1',
      userSelect: 'none'
    },
    contentCard: {
      position: 'relative',
      zIndex: '2',
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      borderRadius: '2rem',
      padding: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      // maxWidth: '500px',
      width: '90%'
    },
    btnPrimary: {
      padding: '0.8rem 2rem',
      borderRadius: '50px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      backgroundColor: '#000',
      border: 'none',
      color: '#fff',
      marginTop: '1.5rem'
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Background Big Text */}
      <h1 style={styles.errorCode}>404</h1>

      {/* Floating Glass Card */}
      <div style={styles.contentCard}>
        <div className="mb-4">
          <h1 className="fw-bold text-dark" style={{ fontSize: '7rem' }}>404</h1>
          <div className="four_zero_four_bg mb-4 d-flex justify-content-center align-items-center">
            <img
              src="/DashboardAssets/assets/images/Error/404.gif"
              alt="Page not found animation"
              style={{
                width: '60%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>

        <h2 className="display-6 fw-bold text-dark mb-3">Way off track?</h2>
        <p className="text-muted mb-4">
          It looks like the page you’re looking for doesn’t exist or has been relocated to another galaxy.
        </p>

        <div className="d-flex flex-column gap-2">
          <button
            style={styles.btnPrimary}
            className="shadow-sm hover-opacity"
            onClick={() => window.history.back()}
          >
            Take Me Back
          </button>

          <button
            className="btn btn-link text-decoration-none text-secondary mt-2"
            onClick={() => window.location.href = '/'}
          >
            Go to Homepage
          </button>
        </div>
      </div>

      {/* Subtle Decorative Elements */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(0, 123, 255, 0.05)',
        filter: 'blur(80px)',
        borderRadius: '50%',
        top: '10%',
        left: '10%'
      }}></div>
    </div>
  );
};

export default Page404;