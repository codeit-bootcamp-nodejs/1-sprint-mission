export default function imageMiddleware(req, res, next) {
  console.log("Image middleware activated");
  next();
}
