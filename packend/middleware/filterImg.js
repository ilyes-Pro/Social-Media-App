const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];

  if (allowed.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    return cb(new Error('Invalid file type'), false);
  }

  //   if(req.path === '/register' && !validate(authSchema)){
  //     cb(validate(authSchema), false);
  //   } else {
  //     cb(null, true);
  //   }
};

export default fileFilter;
